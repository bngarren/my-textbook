import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles({
  gridContainerRoot: {},
  gridItemSide: {},
  paperSide: {
    padding: "6px 8px",
    minHeight: "100px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  },
  gridItemActions: {
    //background: "yellow",
    justifyContent: "center",
  },
});

const CardView = ({ card, onDeleteCard = (f) => f }) => {
  const classes = useStyles();

  const handleDelete = () => {
    onDeleteCard(card.cardId);
  };

  return (
    <Grid container className={classes.gridContainerRoot} spacing={1}>
      <Grid item className={classes.gridItemSide} sm={5} xs={12}>
        <Paper className={classes.paperSide} elevation={2}>
          <Typography variant="h6">{card.side_one}</Typography>
        </Paper>
      </Grid>
      <Grid item className={classes.gridItemSide} sm xs>
        <Paper className={classes.paperSide} elevation={2}>
          <Typography variant="body1">{card.side_two}</Typography>
        </Paper>
      </Grid>
      <Grid item className={classes.gridItemActions} sm={1} xs={12}>
        <IconButton>
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default CardView;
