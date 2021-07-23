import { makeStyles } from "@material-ui/core";

const styles = makeStyles((theme) => ({
  container: {
    marginBottom: theme.spacing(3),
  },
  item: {
    display: "inline-block",
  },
  link: {
    color: theme.palette.text.primary,
    textDecoration: "none",
    fontSize: 18,
  },
  linkActive: {
    display: "block",
    background: "#ddd",
  },
  login: {
    color: "#fff",
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
}));

export default styles;
