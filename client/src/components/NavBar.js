import React from "react";
import { createUseStyles } from "react-jss";
import { Link } from "react-router-dom";

const useStyles = createUseStyles({
  navbar: {
    flexGrow: "1",
    flexShrink: "0",
    flexBasis: "content",
    padding: "0.1em 0.1em 0.1em 2em",
    display: "flex",
    // display: 'none',
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    listStyleType: "none",
    "@media print": {
      display: "none"
    }
  },
  link: {
    color: "#ffffff",
    textDecoration: "none",
    paddingRight: "2em",
    "&:hover": {
      textDecoration: "underline"
    }
  }
});

const NavBar = props => {
  const { account, setLoggedOutAccount, isCreatingNewProject } = props;
  const classes = useStyles();

  const showNewProjectLink = () => {
    return isCreatingNewProject ? null : (
      <li>
        <Link className={classes.link} to="/calculation?pageNo=1&view=w">
          New Project
        </Link>
      </li>
    );
  };

  return (
    <ul className={classes.navbar}>
      <li>
        <Link className={classes.link} to="/">
          Home
        </Link>
      </li>
      <li>
        <Link className={classes.link} to="/about">
          About
        </Link>
      </li>
      <li>
        <Link className={classes.link} to="/projects">
          Projects
        </Link>
      </li>

      {showNewProjectLink()}
      {/* <li>
        <Link className={classes.link} to="/about">About</Link>
      </li>
      <li>
        <Link className={classes.link} to="/contactus">Contact Us</Link>
      </li> */}
      {/* if there's an account in state, display logout and check if they are admin*/}
      {account && account.email ? (
        <>
          {account.role === "admin" ? (
            <li>
              <Link className={classes.link} to="/admin">
                Admin
              </Link>
            </li>
          ) : null}
          <li>
            <button className="link" onClick={setLoggedOutAccount}>
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          {/* if no account in state, show login button*/}
          <li>
            <Link className={classes.link} to="/login">
              Login
            </Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default NavBar;
