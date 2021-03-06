import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { createUseStyles } from "react-jss";
import * as accountService from "../services/account.service";
import { useToast } from "../contexts/Toast";

const useStyles = createUseStyles({
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  pageTitle: {
    marginTop: "2em"
  },
  pageSubtitle: {
    marginTop: "0.5em",
    textAlign: "center",
    fontSize: "20px",
    fontWeight: "normal",
    fontStyle: "normal"
  },
  table: {
    minWidth: "80%",
    margin: "20px"
  },
  tr: {
    margin: "0.5em"
  },
  td: {
    padding: "0.2em",
    textAlign: "left"
  },
  tdCenter: {
    padding: "0.2em",
    textAlign: "center"
  },
  thead: {
    fontWeight: "bold",
    backgroundColor: "#0f2940",
    color: "white",
    "& td": {
      padding: ".4em"
    }
  },
  theadLabel: {
    cursor: "pointer"
  },
  tbody: {
    "& tr td": {
      padding: ".4em 0"
    },
    "& tr:hover": {
      background: "#f0e300"
    }
  },
  link: {
    textDecoration: "underline"
  }
});

const Roles = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const classes = useStyles();
  const toast = useToast();

  useEffect(() => {
    const getAccounts = async () => {
      try {
        const result = await accountService.search();
        setAccounts(result);
        setFilteredAccounts(result);
      } catch (err) {
        console.log(err);
      }
    };
    getAccounts();
  }, []);

  const filt = (allAccounts, searchString) => {
    const str = searchString;
    const filteredAccounts = allAccounts.filter(
      account =>
        str === "" ||
        account.email.toLowerCase().includes(str) ||
        account.firstName.toLowerCase().includes(str) ||
        account.lastName.toLowerCase().includes(str)
    );
    if (filteredAccounts) {
      setFilteredAccounts(filteredAccounts);
    }
  };

  const onInputChange = async (e, account) => {
    const newAccount = { ...account };
    newAccount[e.target.name] = e.target.checked;
    const newAccounts = [...accounts];
    const index = newAccounts.findIndex(a => a.id === newAccount.id);
    newAccounts[index] = newAccount;
    setAccounts(newAccounts);
    filt(newAccounts, searchString);

    const msg = `The ${
      e.target.name === "isAdmin" ? "Admin" : "Security Admin"
    } role has been ${e.target.checked ? "granted to" : "revoked from"} ${
      newAccount.firstName
    } ${newAccount.lastName}.`;
    const reqBody = {
      id: newAccount.id,
      isAdmin: newAccount.isAdmin,
      isSecurityAdmin: newAccount.isSecurityAdmin
    };

    try {
      await accountService.putRoles(reqBody);
      toast.add(msg);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.main}>
      <h1 className={classes.pageTitle}>Security Roles</h1>
      <div className={classes.pageSubtitle}>
        Grant or Revoke Admin Permissions
      </div>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <label htmlFor="searchString" className={classes.textInputLabel}>
          Find:
        </label>
        <input
          className={classes.input}
          name="searchString"
          type="text"
          value={searchString || ""}
          onChange={e => {
            setSearchString(e.target.value);
            filt(accounts, e.target.value);
          }}
          data-testid="searchString"
        />
      </div>

      <table className={classes.table}>
        <thead className={classes.thead}>
          <tr className={classes.tr}>
            <td className={`${classes.td} ${classes.tdheadLabel}`}>Email</td>
            <td className={`${classes.td} ${classes.tdheadLabel}`}>Name</td>
            <td className={`${classes.tdCenter} ${classes.tdheadLabel}`}>
              Admin
            </td>
            <td className={`${classes.tdCenter} ${classes.tdheadLabel}`}>
              Security Admin
            </td>
          </tr>
        </thead>
        <tbody className={classes.tbody}>
          {filteredAccounts &&
            filteredAccounts.map(account => (
              <tr key={JSON.stringify(account)}>
                <td className={classes.td}>{account.email}</td>
                <td
                  className={classes.td}
                >{`${account.lastName}, ${account.firstName}`}</td>
                <td className={classes.tdCenter}>
                  <input
                    type="checkbox"
                    value={true}
                    checked={account.isAdmin}
                    onChange={e => onInputChange(e, account)}
                    name="isAdmin"
                  />
                </td>
                <td className={classes.tdCenter}>
                  <input
                    type="checkbox"
                    value={true}
                    checked={account.isSecurityAdmin}
                    onChange={e => onInputChange(e, account)}
                    name="isSecurityAdmin"
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default withRouter(Roles);
