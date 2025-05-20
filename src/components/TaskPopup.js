import React, { useState, useEffect } from "react";
import { useData } from "../contexts/DataContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  AvatarGroup,
  IconButton,
  Typography,
  styled,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  Close,
  DeleteTwoTone,
} from "@mui/icons-material";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: "1.5rem",
  fontWeight: "bold",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
}));

const StyledTextField = styled(TextField)({
  "& .MuiInput-underline:before": {
    borderBottom: "none",
  },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottom: "none",
  },
  "& .MuiInput-underline:after": {
    borderBottom: "none",
  },
});

function TaskPopup({
  open,
  onClose,
  task,
  onSave,
  boardMembers,
  availableLabels,
}) {
  const [taskName, setTaskName] = useState(task?.content || "");
  const [taskDescription, setTaskDescription] = useState(
    task?.description || ""
  );
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(task?.comments || []);
  const [members, setMembers] = useState(task?.members || []);
  const [labels, setLabels] = useState(task?.labels || []);
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate) : null
  );
  const [checklist, setChecklist] = useState(task?.checklist || []);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const { updateTask } = useData();

  useEffect(() => {
    if (task) {
      setTaskName(task.content || "");
      setTaskDescription(task.description || "");
      setComments(task.comments || []);
      setMembers(
        task.members.map((memberId) =>
          typeof memberId === "string"
            ? boardMembers.find((bm) => bm.id === memberId)
            : memberId
        )
      );
      setLabels(
        task.labels.map((labelId) =>
          typeof labelId === "string"
            ? availableLabels.find((al) => al.id === labelId)
            : labelId
        )
      );
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
      setChecklist(task.checklist || []);
    }
  }, [task, boardMembers, availableLabels]);

  const handleSave = () => {
    const updatedTask = {
      ...task,
      content: taskName,
      description: taskDescription,
      comments: comments,
      members: members.map((member) => member.id),
      labels: labels.map((label) => label.id),
      dueDate: dueDate ? dueDate.toISOString() : null,
      checklist: checklist,
    };
    updateTask(task.id, updatedTask);
    onClose();
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        author: "Current User",
        text: comment,
        timestamp: new Date().toISOString(),
      };
      setComments([...comments, newComment]);
      setComment("");
    }
  };

  const handleAddMember = (event, newValue) => {
    setMembers(newValue);
  };

  const handleAddLabel = (event, newValue) => {
    setLabels(newValue);
  };

  const handleRemoveMember = (memberId) => {
    setMembers(members.filter((member) => member.id !== memberId));
  };

  const handleRemoveLabel = (labelId) => {
    setLabels(labels.filter((label) => label.id !== labelId));
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklist([
        ...checklist,
        { id: Date.now(), text: newChecklistItem, checked: false },
      ]);
      setNewChecklistItem("");
    }
  };

  const handleToggleChecklistItem = (id) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDeleteChecklistItem = (id) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <StyledDialogTitle>
        <StyledTextField
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          variant="standard"
          fullWidth
          InputProps={{
            style: { color: "inherit", fontSize: "inherit" },
          }}
        />
        <IconButton onClick={onClose} color="inherit">
          <Close />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent>
        <Box display="flex" gap={3}>
          <Box flexGrow={1}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Description
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              placeholder="Add a more detailed description..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {labels.map((label) => (
                  <Chip
                    key={label.id}
                    label={label.name}
                    size="small"
                    sx={{
                      backgroundColor: label.color,
                      color: "white",
                      fontWeight: "bold",
                    }}
                    onDelete={() => handleRemoveLabel(label.id)}
                  />
                ))}
              </Box>
              <AvatarGroup max={5}>
                {members.map((member) => (
                  <Avatar
                    key={member.id}
                    alt={member.name}
                    src={member.imageUrl}
                    title={member.name}
                  />
                ))}
              </AvatarGroup>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Due Date
            </Typography>
            <TextField
              type="date"
              fullWidth
              value={dueDate ? dueDate.toISOString().split("T")[0] : ""}
              onChange={(e) => setDueDate(new Date(e.target.value))}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Checklist
            </Typography>
            <Box display="flex" gap={1} mb={2}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add checklist item"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddChecklistItem}
              >
                Add
              </Button>
            </Box>
            <List>
              {checklist.map((item) => (
                <ListItem key={item.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={item.checked}
                        onChange={() => handleToggleChecklistItem(item.id)}
                      />
                    }
                    label={item.text}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteChecklistItem(item.id)}
                    >
                      <DeleteTwoTone />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddComment}
              sx={{ mb: 3 }}
            >
              Add Comment
            </Button>

            <List>
              {comments.map((comment) => (
                <React.Fragment key={comment.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt={comment.author}
                        src="/static/images/avatar/1.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={comment.author}
                      secondary={
                        <>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {comment.text}
                          </Typography>
                          <br />
                          {new Date(comment.timestamp).toLocaleString()}
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box width={200}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Actions
            </Typography>
            <Autocomplete
              multiple
              id="members-selection"
              options={boardMembers}
              getOptionLabel={(option) => option.name}
              value={members}
              onChange={handleAddMember}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Members"
                  placeholder="Add members"
                  SelectProps={{ MenuProps: { disableScrollLock: true } }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    onDelete={() => handleRemoveMember(option.id)}
                  />
                ))
              }
            />
            <Box sx={{ mt: 2 }} />
            <Autocomplete
              multiple
              id="labels-selection"
              options={availableLabels}
              getOptionLabel={(option) => option.name}
              value={labels}
              onChange={handleAddLabel}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Labels"
                  placeholder="Add labels"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    style={{ backgroundColor: option.color, color: "white" }}
                    onDelete={() => handleRemoveLabel(option.id)}
                  />
                ))
              }
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}

export default TaskPopup;