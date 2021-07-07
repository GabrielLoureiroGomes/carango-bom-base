import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: theme.spacing(3),
  },
  item: {
    display: "inline-block",
  },
  link: {
    textDecoration: "none",
  },
  linkActive: {
    textDecoration: "underline",
  },
}));
