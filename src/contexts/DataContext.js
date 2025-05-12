import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, writeBatch, arrayUnion, arrayRemove } from 'firebase/firestore';
import { initialProjects, initialBoards, initialColumns, initialTasks, dummyMembers, dummyLabels } from '../initialData.js';
import { CONFIG } from '../config';
import { debounce } from 'lodash';

const firebaseConfig = {
  apiKey: "AIzaSyBNuKT_D9NMlIzmE2sNfLI5-0JwHsRBPco",
  authDomain: "teamlist-a2f1c.firebaseapp.com",
  projectId: "teamlist-a2f1c",
  storageBucket: "teamlist-a2f1c.appspot.com",
  messagingSenderId: "401780644077",
  appId: "1:401780644077:web:0274114fb7b282ed5e94e4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [boards, setBoards] = useState([]);
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [labels, setLabels] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [dataSource] = useState(CONFIG.DATA_SOURCE);
  
  const [localCache, setLocalCache] = useState({
    projects: [],
    boards: [],
    columns: [],
    tasks: [],
  });
  const syncTimeoutRef = useRef(null);

  // Session timeout duration (e.g., 30 minutes in milliseconds)
  const SESSION_TIMEOUT = 5 * 60 * 60 * 1000; // 30 minutes

  const syncToFirebase = useCallback(async () => {
    if (dataSource !== 'firebase') return;

    console.log('Starting sync to Firebase...');

    const batch = writeBatch(db);

    localCache.projects.forEach(project => {
      const projectRef = doc(db, 'projects', project.id);
      batch.set(projectRef, project, { merge: true });
    });

    localCache.boards.forEach(board => {
      const boardRef = doc(db, 'boards', board.id);
      batch.set(boardRef, board, { merge: true });
    });

    localCache.columns.forEach(column => {
      const columnRef = doc(db, 'columns', column.id);
      batch.set(columnRef, column, { merge: true });
    });

    localCache.tasks.forEach(task => {
      const taskRef = doc(db, 'tasks', task.id);
      batch.set(taskRef, task, { merge: true });
    });

    try {
      await batch.commit();
      console.log('Sync to Firebase completed successfully');
    } catch (error) {
      console.error('Error syncing to Firebase:', error);
    }
  }, [dataSource, localCache]);

  const debouncedSyncToFirebase = debounce(syncToFirebase, 5000);

  const initializeColumns = useCallback((columns, tasks) => {
    return columns.map(column => ({
      ...column,
      taskIds: tasks.filter(task => task.columnId === column.id).map(task => task.id),
      order: column.order || 0
    }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (dataSource === 'firebase') {
        try {
          const fetchCollection = async (collectionName) => {
            const snapshot = await getDocs(collection(db, collectionName));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          };

          const [fetchedProjects, fetchedBoards, fetchedColumns, fetchedTasks, fetchedMembers, fetchedLabels] = await Promise.all([
            fetchCollection('projects'),
            fetchCollection('boards'),
            fetchCollection('columns'),
            fetchCollection('tasks'),
            fetchCollection('members'),
            fetchCollection('labels')
          ]);

          const initializedColumns = initializeColumns(fetchedColumns, fetchedTasks);

          setProjects(fetchedProjects);
          setBoards(fetchedBoards);
          setColumns(initializedColumns);
          setTasks(fetchedTasks);
          setMembers(fetchedMembers);
          setLabels(fetchedLabels);

          setLocalCache({
            projects: fetchedProjects,
            boards: fetchedBoards,
            columns: initializedColumns,
            tasks: fetchedTasks,
          });

        } catch (error) {
          console.error("Error fetching data from Firebase:", error);
        }
      } else {
        const initializedColumns = initializeColumns(initialColumns, initialTasks);
        setProjects(initialProjects);
        setBoards(initialBoards);
        setColumns(initializedColumns);
        setTasks(initialTasks);
        setMembers(dummyMembers);
        setLabels(dummyLabels);
        setLocalCache({
          projects: initialProjects,
          boards: initialBoards,
          columns: initializedColumns,
          tasks: initialTasks,
        });
      }
    };

    // Load persisted user from localStorage
    const persistedSession = JSON.parse(localStorage.getItem('userSession'));
    if (persistedSession && persistedSession.user) {
      const { user, loginTime } = persistedSession;
      const currentTime = Date.now();
      if (currentTime - loginTime < SESSION_TIMEOUT) {
        setCurrentUser(user); // Restore user if session is still valid
      } else {
        localStorage.removeItem('userSession'); // Clear expired session
      }
    }

    fetchData();
  }, [dataSource, initializeColumns]);

  // Auto-logout timer
  useEffect(() => {
    let logoutTimer;

    if (currentUser) {
      const loginTime = JSON.parse(localStorage.getItem('userSession'))?.loginTime || Date.now();
      const timeElapsed = Date.now() - loginTime;
      const timeRemaining = SESSION_TIMEOUT - timeElapsed;

      if (timeRemaining > 0) {
        logoutTimer = setTimeout(() => {
          logout();
        }, timeRemaining);
      } else {
        logout(); // Immediately log out if session has already expired
      }
    }

    return () => clearTimeout(logoutTimer); // Cleanup timer on unmount or user change
  }, [currentUser]);

  const scheduleSync = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    syncTimeoutRef.current = setTimeout(() => {
      syncToFirebase();
    }, 5000);
  }, [syncToFirebase]);

  // CRUD operations

  const addProject = async (project) => {
    const newProject = { ...project, id: Date.now().toString() };
    setLocalCache(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
    setProjects(prev => [...prev, newProject]);
    
    if (dataSource === 'firebase') {
      try {
        await setDoc(doc(db, 'projects', newProject.id), newProject);
        console.log('Project added to Firebase:', newProject.id);
      } catch (error) {
        console.error('Error adding project to Firebase:', error);
      }
    }
    
    scheduleSync();
    return newProject;
  };

  const updateProject = async (projectId, projectData) => {
    setLocalCache(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === projectId ? { ...p, ...projectData } : p)
    }));
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...projectData } : p));
    
    if (dataSource === 'firebase') {
      try {
        await updateDoc(doc(db, 'projects', projectId), projectData);
        console.log('Project updated in Firebase:', projectId);
      } catch (error) {
        console.error('Error updating project in Firebase:', error);
      }
    }
    
    scheduleSync();
    return true;
  };

  const deleteProject = async (projectId) => {
    setLocalCache(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId),
      boards: prev.boards.filter(b => b.projectId !== projectId)
    }));
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setBoards(prev => prev.filter(b => b.projectId !== projectId));
    
    if (dataSource === 'firebase') {
      try {
        await deleteDoc(doc(db, 'projects', projectId));
        console.log('Project deleted from Firebase:', projectId);
      } catch (error) {
        console.error('Error deleting project from Firebase:', error);
      }
    }
    
    scheduleSync();
    return true;
  };

  const addBoard = async (projectId, board) => {
    const newBoard = { ...board, projectId, id: Date.now().toString() };
    setLocalCache(prev => ({
      ...prev,
      boards: [...prev.boards, newBoard]
    }));
    setBoards(prev => [...prev, newBoard]);
    
    if (dataSource === 'firebase') {
      try {
        await setDoc(doc(db, 'boards', newBoard.id), newBoard);
        console.log('Board added to Firebase:', newBoard.id);
      } catch (error) {
        console.error('Error adding board to Firebase:', error);
      }
    }
    
    scheduleSync();
    return newBoard;
  };

  const updateBoard = async (boardId, boardData) => {
    setLocalCache(prev => ({
      ...prev,
      boards: prev.boards.map(b => b.id === boardId ? { ...b, ...boardData } : b)
    }));
    setBoards(prev => prev.map(b => b.id === boardId ? { ...b, ...boardData } : b));
    
    if (dataSource === 'firebase') {
      try {
        await updateDoc(doc(db, 'boards', boardId), boardData);
        console.log('Board updated in Firebase:', boardId);
      } catch (error) {
        console.error('Error updating board in Firebase:', error);
      }
    }
    
    scheduleSync();
    return true;
  };

  const deleteBoard = async (boardId) => {
    setLocalCache(prev => ({
      ...prev,
      boards: prev.boards.filter(b => b.id !== boardId),
      columns: prev.columns.filter(c => c.boardId !== boardId),
      tasks: prev.tasks.filter(t => t.boardId !== boardId)
    }));
    setBoards(prev => prev.filter(b => b.id !== boardId));
    setColumns(prev => prev.filter(c => c.boardId !== boardId));
    setTasks(prev => prev.filter(t => t.boardId !== boardId));
    
    if (dataSource === 'firebase') {
      try {
        await deleteDoc(doc(db, 'boards', boardId));
        console.log('Board deleted from Firebase:', boardId);
      } catch (error) {
        console.error('Error deleting board from Firebase:', error);
      }
    }
    
    scheduleSync();
    return true;
  };

  const addColumn = async (boardId, column) => {
    const board = boards.find(b => b.id === boardId);
    const maxOrder = Math.max(...columns.filter(c => c.boardId === boardId).map(c => c.order), 0);
    const newColumn = { ...column, boardId, id: Date.now().toString(), taskIds: [], order: maxOrder + 1 };
    
    setLocalCache(prev => ({
      ...prev,
      columns: [...prev.columns, newColumn]
    }));
    setColumns(prev => [...prev, newColumn]);
    
    if (dataSource === 'firebase') {
      try {
        const batch = writeBatch(db);
        batch.set(doc(db, 'columns', newColumn.id), newColumn);
        batch.update(doc(db, 'boards', boardId), {
          columnIds: arrayUnion(newColumn.id)
        });
        await batch.commit();
        console.log('Column added to Firebase:', newColumn.id);
      } catch (error) {
        console.error('Error adding column to Firebase:', error);
      }
    }
    
    scheduleSync();
    return newColumn;
  };

  const updateColumn = async (columnId, columnData) => {
    setLocalCache(prev => ({
      ...prev,
      columns: prev.columns.map(c => c.id === columnId ? { ...c, ...columnData } : c)
    }));
    setColumns(prev => prev.map(c => c.id === columnId ? { ...c, ...columnData } : c));
    
    if (dataSource === 'firebase') {
      try {
        await updateDoc(doc(db, 'columns', columnId), columnData);
        console.log('Column updated in Firebase:', columnId);
      } catch (error) {
        console.error('Error updating column in Firebase:', error);
      }
    }
    
    scheduleSync();
    return true;
  };

  const deleteColumn = async (columnId) => {
    const columnToDelete = columns.find(c => c.id === columnId);
    if (!columnToDelete) {
      console.error('Column not found:', columnId);
      return false;
    }

    setLocalCache(prev => ({
      ...prev,
      columns: prev.columns.filter(c => c.id !== columnId),
      tasks: prev.tasks.filter(t => t.columnId !== columnId)
    }));
    setColumns(prev => prev.filter(c => c.id !== columnId));
    setTasks(prev => prev.filter(t => t.columnId !== columnId));
    
    if (dataSource === 'firebase') {
      try {
        const batch = writeBatch(db);
        
        batch.delete(doc(db, 'columns', columnId));
        
        batch.update(doc(db, 'boards', columnToDelete.boardId), {
          columnIds: arrayRemove(columnId)
        });

        const tasksToDelete = tasks.filter(t => t.columnId === columnId);
        tasksToDelete.forEach(task => {
          batch.delete(doc(db, 'tasks', task.id));
        });

        await batch.commit();
        console.log('Column and associated tasks deleted from Firebase:', columnId);
      } catch (error) {
        console.error('Error deleting column from Firebase:', error);
        return false;
      }
    }
    
    scheduleSync();
    return true;
  };

  const addTask = async (columnId, task) => {
    const newTask = { ...task, columnId, id: Date.now().toString() };
    setLocalCache(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
      columns: prev.columns.map(column => 
        column.id === columnId 
          ? { ...column, taskIds: [...(column.taskIds || []), newTask.id] }
          : column
      )
    }));
    setTasks(prev => [...prev, newTask]);
    setColumns(prev => prev.map(column => 
      column.id === columnId 
        ? { ...column, taskIds: [...(column.taskIds || []), newTask.id] }
        : column
    ));
    
    if (dataSource === 'firebase') {
      try {
        await setDoc(doc(db, 'tasks', newTask.id), newTask);
        await updateDoc(doc(db, 'columns', columnId), {
          taskIds: arrayUnion(newTask.id)
        });
        console.log('Task added to Firebase:', newTask.id);
      } catch (error) {
        console.error('Error adding task to Firebase:', error);
      }
    }
    
    scheduleSync();
    return newTask;
  };

  const updateTask = async (taskId, taskData) => {
    console.log('Updating task:', taskId, taskData);

    // Get the current task data before updating
    const currentTask = tasks.find(t => t.id === taskId);

    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...taskData } : t));
    setLocalCache(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, ...taskData } : t)
    }));

    if (dataSource === 'firebase') {
      try {
        const taskRef = doc(db, 'tasks', taskId);
        await updateDoc(taskRef, taskData);
        console.log('Task updated in Firebase:', taskId);

        // If the column has changed, update the columns in Firebase
        if (taskData.columnId && taskData.columnId !== currentTask.columnId) {
          const batch = writeBatch(db);

          const oldColumn = localCache.columns.find(c => c.taskIds.includes(taskId));
          const newColumn = localCache.columns.find(c => c.id === taskData.columnId);

          if (oldColumn && oldColumn.id !== newColumn.id) {
            batch.update(doc(db, 'columns', oldColumn.id), {
              taskIds: arrayRemove(taskId)
            });
          }

          if (newColumn) {
            batch.update(doc(db, 'columns', newColumn.id), {
              taskIds: arrayUnion(taskId)
            });
          }

          await batch.commit();
          console.log('Columns updated in Firebase');
        }

        // Update columns in local state if needed
        if (taskData.columnId && taskData.columnId !== currentTask.columnId) {
          setColumns(prev => prev.map(column => {
            if (column.taskIds.includes(taskId) && column.id !== taskData.columnId) {
              return { ...column, taskIds: column.taskIds.filter(id => id !== taskId) };
            }
            if (column.id === taskData.columnId && !column.taskIds.includes(taskId)) {
              return { ...column, taskIds: [...column.taskIds, taskId] };
            }
            return column;
          }));
        }

      } catch (error) {
        console.error('Error updating task in Firebase:', error);
        // Revert local changes if Firebase update fails
        setTasks(prev => prev.map(t => t.id === taskId ? currentTask : t));
        setLocalCache(prev => ({
          ...prev,
          tasks: prev.tasks.map(t => t.id === taskId ? currentTask : t)
        }));
        return false;
      }
    }

    debouncedSyncToFirebase();
    return true;
  };

  const moveTask = async (taskId, sourceColumnId, destinationColumnId, newIndex) => {
    const task = tasks.find(t => t.id === taskId);
    const updatedTask = { ...task, columnId: destinationColumnId };

    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    setColumns(prev => prev.map(column => {
      if (column.id === sourceColumnId) {
        return { ...column, taskIds: column.taskIds.filter(id => id !== taskId) };
      }
      if (column.id === destinationColumnId) {
        const newTaskIds = [...column.taskIds];
        newTaskIds.splice(newIndex, 0, taskId);
        return { ...column, taskIds: newTaskIds };
      }
      return column;
    }));

    if (dataSource === 'firebase') {
      try {
        const batch = writeBatch(db);
        
        // Update task
        batch.update(doc(db, 'tasks', taskId), { columnId: destinationColumnId });

        // Update source column
        batch.update(doc(db, 'columns', sourceColumnId), {
          taskIds: arrayRemove(taskId)
        });

        // Update destination column
        const destColumn = columns.find(c => c.id === destinationColumnId);
        const newTaskIds = [...destColumn.taskIds];
        newTaskIds.splice(newIndex, 0, taskId);
        batch.update(doc(db, 'columns', destinationColumnId), {
          taskIds: newTaskIds
        });

        await batch.commit();
        console.log('Task moved in Firebase');
      } catch (error) {
        console.error('Error moving task in Firebase:', error);
        // Revert optimistic update if Firebase update fails
        setTasks(prev => prev.map(t => t.id === taskId ? task : t));
        setColumns(prev => {
          const sourceColumn = prev.find(c => c.id === sourceColumnId);
          const destColumn = prev.find(c => c.id === destinationColumnId);
          return prev.map(column => {
            if (column.id === sourceColumnId) {
              return { ...column, taskIds: sourceColumn.taskIds };
            }
            if (column.id === destinationColumnId) {
              return { ...column, taskIds: destColumn.taskIds };
            }
            return column;
          });
        });
        setLocalCache(prev => ({
          ...prev,
          tasks: prev.tasks.map(t => t.id === taskId ? task : t),
          columns: prev.columns.map(column => {
            if (column.id === sourceColumnId) {
              return { ...column, taskIds: prev.columns.find(c => c.id === sourceColumnId).taskIds };
            }
            if (column.id === destinationColumnId) {
              return { ...column, taskIds: prev.columns.find(c => c.id === destinationColumnId).taskIds };
            }
            return column;
          })
        }));
        return false;
      }
    }

    debouncedSyncToFirebase();
    return true;
  };

  const deleteTask = async (taskId) => {
    console.log('Attempting to delete task:', taskId);
  
    if (dataSource === 'firebase') {
      try {
        // Find the column containing this task in the local cache
        const columnWithTask = localCache.columns.find(c => c.taskIds.includes(taskId));
        
        // Start a batch write
        const batch = writeBatch(db);
  
        // Delete the task from Firebase
        const taskRef = doc(db, 'tasks', taskId);
        batch.delete(taskRef);
  
        if (columnWithTask) {
          // Update the column in Firebase to remove the task ID
          const columnRef = doc(db, 'columns', columnWithTask.id);
          batch.update(columnRef, {
            taskIds: arrayRemove(taskId)
          });
        }
  
        // Commit the batch
        await batch.commit();
        console.log('Task and column references updated in Firebase');
      } catch (error) {
        console.error('Error deleting task from Firebase:', error);
        return false;
      }
    }
  
    // Update local cache
    setLocalCache(prev => {
      const updatedColumns = prev.columns.map(column => ({
        ...column,
        taskIds: column.taskIds.filter(id => id !== taskId)
      }));
      return {
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== taskId),
        columns: updatedColumns
      };
    });

    // Update React state
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setColumns(prev => prev.map(column => ({
      ...column,
      taskIds: column.taskIds.filter(id => id !== taskId)
    })));

    console.log('Local state updated after task deletion');
    scheduleSync();
    return true;
  };

/// new reorder tasks in column function

const reorderTasksInColumn = async (columnId, newTaskOrder) => {
  console.log('Reordering tasks in column:', columnId, newTaskOrder);

  // Optimistic update
  setColumns(prev => prev.map(column => 
    column.id === columnId ? { ...column, taskIds: newTaskOrder } : column
  ));

  setLocalCache(prev => ({
    ...prev,
    columns: prev.columns.map(column => 
      column.id === columnId ? { ...column, taskIds: newTaskOrder } : column
    )
  }));

  if (dataSource === 'firebase') {
    try {
      await updateDoc(doc(db, 'columns', columnId), { taskIds: newTaskOrder });
      console.log('Tasks reordered in Firebase for column:', columnId);
    } catch (error) {
      console.error('Error reordering tasks in Firebase:', error);
      // Revert optimistic update if Firebase update fails
      const originalColumn = columns.find(c => c.id === columnId);
      setColumns(prev => prev.map(column => 
        column.id === columnId ? originalColumn : column
      ));
      setLocalCache(prev => ({
        ...prev,
        columns: prev.columns.map(column => 
          column.id === columnId ? originalColumn : column
        )
      }));
      return false;
    }
  }

  debouncedSyncToFirebase();
  return true;
};

////

  const reorderColumns = async (boardId, newOrder) => {
    const updatedColumns = columns
      .filter(column => column.boardId === boardId)
      .map((column, index) => ({ ...column, order: newOrder[index].order }));

    setLocalCache(prev => ({
      ...prev,
      columns: prev.columns.map(c => 
        updatedColumns.find(uc => uc.id === c.id) || c
      )
    }));
    setColumns(prev => prev.map(c => 
      updatedColumns.find(uc => uc.id === c.id) || c
    ));

    if (dataSource === 'firebase') {
      const batch = writeBatch(db);
      try {
        updatedColumns.forEach(column => {
          batch.update(doc(db, 'columns', column.id), { order: column.order });
        });
        await batch.commit();
        console.log('Columns reordered in Firebase');
      } catch (error) {
        console.error('Error reordering columns in Firebase:', error);
        return false;
      }
    }

    scheduleSync();
    return true;
  };

  const login = (user) => {
    const sessionData = {
      user,
      loginTime: Date.now(),
    };
    setCurrentUser(user);
    localStorage.setItem('userSession', JSON.stringify(sessionData));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('userSession');
  };

  const getUserProjects = useCallback(() => {
    return projects.filter(project => 
      currentUser?.email === 'superadmin@example.com' || project.members.includes(currentUser?.id)
    );
  }, [projects, currentUser]);

  const getUserBoards = useCallback(() => {
    const userProjects = getUserProjects();
    return boards.filter(board => 
      userProjects.some(project => project.id === board.projectId) &&
      (currentUser?.email === 'superadmin@example.com' || board.members.includes(currentUser?.id))
    );
  }, [boards, getUserProjects, currentUser]);

  const getUserColumns = useCallback(() => {
    const userBoards = getUserBoards();
    return columns.filter(column => 
      userBoards.some(board => board.id === column.boardId)
    );
  }, [columns, getUserBoards]);

  const getUserTasks = useCallback(() => {
    const userColumns = getUserColumns();
    return tasks.filter(task => 
      userColumns.some(column => column.id === task.columnId)
    );
  }, [tasks, getUserColumns]);

  const getUserColumnsForBoard = useCallback((boardId) => {
    return columns.filter(column => column.boardId === boardId);
  }, [columns]);

  const getUserTasksForBoard = useCallback((boardId) => {
    return tasks.filter(task => task.boardId === boardId);
  }, [tasks]);

  const value = {
    projects,
    boards,
    columns,
    tasks,
    members,
    labels,
    currentUser,
    addProject,
    updateProject,
    deleteProject,
    addBoard,
    updateBoard,
    deleteBoard,
    addColumn,
    updateColumn,
    deleteColumn,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    reorderTasksInColumn,
    login,
    logout,
    getUserProjects,
    getUserBoards,
    getUserColumns,
    getUserTasks,
    getUserColumnsForBoard,
    getUserTasksForBoard,
    reorderColumns,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;