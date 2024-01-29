import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import useValidation from "../Hooks/useValidation";
import { postRequestMethod } from "../api/api";
import { MANAGE_USER_LOGIN, MANAGE_USER_REGISTER } from "../api/server";
import { Alert, Snackbar } from "@mui/material";
const theme = createTheme();

export default function Register() {
  const { eventHandler } = useValidation();
  const [authorization, setAuthorization] = useState<any | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // SnackBar
  const [snackMessage, setSnackMessage] = useState<string>("");

  const [register, setRegister] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const validationHandler = async (e: any, alterName?: any) => {
    const val = e.target.value;
    const id = alterName;
    if (id) {
      let prom = new Promise((resolve) => {
        if (true) {
          resolve(eventHandler(id, val));
        }
      });
      prom.then((res) => setError({ ...error, [e.target.name]: res }));
    }
    setRegister({ ...register, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    try {
      const result = postRequestMethod(MANAGE_USER_REGISTER, "", register);
      result.then((res: any) => {
        console.log("response is", res);
        console.log("message", res.data.message);
        if (res.data?.message) {
            setSnackMessage(res.data?.message);
            setOpenSnackbar(true);
        } else {
          sessionStorage.setItem("user", JSON.stringify(res.data.user));
          sessionStorage.setItem("token", JSON.stringify(res.data.auth))
          setAuthorization(sessionStorage.getItem("token"));
          setSnackMessage("User Logged Successfully...");
          navigate("/dashboard");
        }
      });
    } catch (error) {
      console.error("Error submitting login:", error);
    }
  };

  // useEffect(() => {
  //   if (authorization !== null) {
  //     setTimeout(() => {
  //       navigate("/dashboard");
  //     }, 1000);
  //   }
  // }, [authorization]);

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        component="main"
        justifyContent="center"
        maxWidth="xl"
        sx={{ mt: { xs: "18%", sm: "14%", lg: "3%" }, mb: "3%" }}
      >
        <Grid
          container
          component={Paper}
          square
          elevation={20}
          justifyContent="center"
          sx={{
            height: "75%",
            width: "50%",
          }}
        >+
          <CssBaseline />

        

          <Grid item xs={12} sm={12} md={6} padding={5}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start ",
                justifyContent: "start",
              }}
            >
              <Typography
                component="h1"
                variant="h5"
                sx={{ color: "#191970", fontWeight: "500" }}
                gutterBottom
              >
                Register
              </Typography>
          

              <Box component="form" onSubmit={handleSubmit}>
              
                <TextField
                  sx={{ background: "white" }}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={Boolean(error.email)}
                  helperText={error.email}
                  autoFocus
                  onChange={(e) => {
                    validationHandler(e, "email");
                  }}
                />

                <TextField
                  sx={{ background: "white" }}
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  error={Boolean(error.password)}
                  helperText={error.password}
                  onChange={(e) => {
                    validationHandler(e, "password");
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, p: 2 }}
                >
                  Register
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
                  open={openSnackbar}
                  autoHideDuration={3000}
                  onClose={() => setOpenSnackbar(false)}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="success"
                  >
                {snackMessage}
                  </Alert>
                </Snackbar>
   
    </ThemeProvider>
  );
}
