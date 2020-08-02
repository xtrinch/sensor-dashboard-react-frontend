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
      main: ColorsEnum.VIOLET,
    },
    // divider: ColorsEnum.BGDARK,
    error: { main: "#ff8a65" },
    secondary: {
      main: ColorsEnum.GRAY,
    },
    text: {
      primary: ColorsEnum.GRAY,
      secondary: ColorsEnum.GRAY,
    },
  },
  overrides: {
    MuiListItemIcon: {
      root: {
        minWidth: "35px",
      },
    },
    MuiListSubheader: {
      root: {
        fontSize: "13px",
        textTransform: "uppercase",
        fontWeight: "normal",
      },
    },
    MuiTypography: {
      h5: {
        color: ColorsEnum.GRAY,
      },
    },
    MuiButtonBase: {
      root: {
        color: ColorsEnum.GRAY,
      },
    },
    MuiListItem: {
      root: {
        color: ColorsEnum.GRAY,
      },
    },
  },
});

export default theme;
