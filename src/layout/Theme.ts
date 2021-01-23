import { createMuiTheme } from "@material-ui/core";
import ColorsEnum from "types/ColorsEnum";

const theme = createMuiTheme({
  spacing: 2,
  typography: {
    fontFamily: "Roboto",
    fontSize: 12,
  },
  palette: {
    type: "dark",
    primary: {
      main: ColorsEnum.BLUE,
    },
    // divider: ColorsEnum.BGDARK,
    error: { main: "#ff8a65" },
    secondary: {
      main: ColorsEnum.GRAYDARK,
    },
    text: {
      primary: ColorsEnum.GRAY,
      secondary: ColorsEnum.GRAY,
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        a: {
          textDecoration: "none",
          color: ColorsEnum.OLIVE,
          fontWeight: "bold",
          "&:hover": {
            color: ColorsEnum.OLIVE,
            textDecoration: "underline",
          },
        },
      },
    },
    MuiTypography: {
      body1: {
        fontSize: "12px",
        color: ColorsEnum.GRAY,
      },
      h4: {
        textTransform: "uppercase",
        color: ColorsEnum.WHITE,
        fontSize: "14px",
        fontWeight: "bold",
      },
      h5: {
        color: ColorsEnum.GRAY,
      },
      h6: {
        fontSize: "15px",
        fontWeight: "normal",
      },
    },
    MuiFab: {
      root: {
        boxShadow: "none",
        color: ColorsEnum.WHITE,
      },
      sizeSmall: {
        width: "35px",
        height: "35px",
      },
    },
    MuiListItem: {
      root: {
        color: ColorsEnum.GRAY,
      },
      divider: {
        borderBottomColor: ColorsEnum.BGLIGHT,
        borderBottomWidth: "0px",
      },
    },
    MuiTableCell: {
      head: {
        textTransform: "uppercase",
        fontSize: "11px",
        color: "white",
        fontWeight: "bold",
      },
      root: {
        borderColor: `${ColorsEnum.BGDARK}!important`,
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: "35px",
      },
    },
    MuiInput: {
      underline: {
        "&:before": {
          borderBottomWidth: "0px",
        },
      },
    },
    MuiListSubheader: {
      root: {
        fontSize: "13px",
        textTransform: "uppercase",
        fontWeight: "normal",
      },
    },
    MuiButtonBase: {
      root: {
        color: ColorsEnum.GRAY,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: "transparent",
      },
    },
    MuiButton: {
      outlinedSecondary: {
        color: ColorsEnum.GRAY,
      },
      root: {
        color: ColorsEnum.WHITE,
        boxShadow: "none",
      },
      containedPrimary: {
        color: ColorsEnum.WHITE,
      },
      contained: {
        boxShadow: "none",
      },
    },
    MuiDrawer: {
      paperAnchorDockedLeft: {
        borderRight: "0px",
      },
    },
    MuiOutlinedInput: {
      notchedOutline: {
        borderRadius: "0px",
        borderColor: ColorsEnum.GRAYDARK,
        opacity: 1,
        // backgroundColor: ColorsEnum.BGLIGHTER,
        // color: 'white!important',
      },
      input: {
        "&:disabled": {
          backgroundColor: ColorsEnum.BGLIGHTER,
        },
      },
      inputMarginDense: {
        paddingTop: "11px",
        paddingBottom: "11px",
      },
    },
  },
});

export default theme;
