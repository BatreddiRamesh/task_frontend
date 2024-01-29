import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import useValidation from "../Hooks/useValidation";
import { saveAs } from "file-saver";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
  } from "@mui/icons-material";
// import CommonSnackBar from "../../Components/Common/CommonSnackbar";
import LinearProgress from "@mui/material/LinearProgress";
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
// import { useNavigate } from "react-router-dom";
import  { deleteRequest, getRequest, getRequestById, postRequestMethod } from "../api/api";
import {
 MANAGE_FILE_POST, MANAGE_FILE_GET, MANAGE_FILE_DEL, MANAGE_FILE_DOWNLOAD
} from "../api/server";

function ManageFile() {
  let { eventHandler } = useValidation();

  const [fileDetails, setFileDetails] = useState<any[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [users1, setUsers1] = useState<any[]>([]);
  //for progress bar
  const [isLoading, setLoading] = useState(false);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };

  const [data, setData] = useState<any>({
    
    fileDoc: undefined,
 
  });

  const [errors, setErrors] = useState({

    fileDoc: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validator()) {
      try {
        setLoading(true);
        const res = await postRequestMethod(
          MANAGE_FILE_POST,
          "multipart/form-data",
          data
        );
        console.log(res);
        setOpenSnackbar(true);
        fetchDetails();
      
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };


  const ValidationHandler = async (e: any, alterName?: any) => {
    try {
      const val = alterName !== "file" ? e.target.value : e.target.files[0];
      const id = alterName;

      if (id) {
        let prom = new Promise((resolve, reject) => {
          if (true) {
            resolve(eventHandler(id, val));
          }
        });

        prom
          .then((res) => {
            setErrors({ ...errors, [e.target.name]: res });
            return res;
          })
          .then((res) => {
            setData({ ...data, [e.target.name]: val });
            return res;
          });
      } else {
        setData({ ...data, [e.target.name]: val });
      }
    } catch (error) {
      console.error("Error in ValidationHandler:", error);
    }
  };

  // to check fields are filled or not
  const validator = () => {
    try {
      for (let field in errors) {
        if (errors[field as keyof typeof errors] !== "") {
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Error in validator:", error);
      return false;
    }
  };

//   React.useEffect(() => {
//     getDropdownData();
//   }, []);
async function fetchDetails() {
    const response = await getRequest(MANAGE_FILE_GET, "");
    if (response) {
      setFileDetails(response.data);
    //   setSearchApiData(response.data);
      console.log("Data: ", response.data);
    }
  }

  const handleClickOpen = (id: any) => {
    try {
      setOpen(true);
      console.log(id);
      setUsers1(id);
      console.log(users1);
    } catch (error) {
      console.error("Error in handleClickOpen:", error);
    }
  };

  const handleClose = () => {
    try {
      setOpen(false);
    } catch (error) {
      console.error("Error in handleClose:", error);
    }
  };

  const deleteData = async (id: any) => {
    try {
      const res = await deleteRequest(MANAGE_FILE_DEL, id, "");
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleDownload = async (id: any) => {
    try {
      const response:any=await getRequestById(MANAGE_FILE_DOWNLOAD,id,"blob")
      console.log("response", response.data);
      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, "downloaded_file.pdf");
    } catch (error) {
      console.error("Error in handleDownload:", error);
    }
  };

React.useEffect(() => {
    

    fetchDetails();
  }, []);

  return (
    <>
     
      <Container>
        {isLoading && <LinearProgress />}
        <Paper elevation={20} sx={{ p: 5 }} component="form"
              onSubmit={handleSubmit}
              encType="multipart/form-data">
         
           <TextField
                    sx={{ background: "white", mx: 4 }}
                    type="file"
                    // inputProps={{ accept: "application/pdf" }}
                    required
                    fullWidth
                    name="fileDoc"
                    error={Boolean(errors.fileDoc)}
                    helperText={errors.fileDoc}
                    onChange={(e) => ValidationHandler(e, "file")}
                  ></TextField>
        
          <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 1, px: 4, mx: 4 }}
                >
                  Upload
                </Button>
          
        </Paper>
      </Container>
      
      {fileDetails&&fileDetails.length >0 && (
        <>
          <Container>
            <Paper elevation={20}>
              <Grid
                container
                sx={{
                  p: 2,
                  background: "#0288d1",
                  color: "white",
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="h5">Manage University</Typography>
                </Grid>
               
                {/* <Grid
                  item
                  xs={4}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <FormControl>
                    <TextField
                      label="Search "
                      size="small"
                      value={filterVal}
                      onInput={(e: any) => handleFilter(e)}
                      sx={{ mx: 3, background: "white" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton edge="end">
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                </Grid> */}

               
              </Grid>

              <Grid sx={{ position: "relative" }}>
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
                File Uploaded Successfully
                  </Alert>
                </Snackbar>

                <TableContainer className="scrollBarCss">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{
                            textAlign: "center",
                            border: "1px solid #ddd",
                            fontSize: "15px",
                          }}
                        >
                          S.No
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            textAlign: "center",
                            border: "1px solid #ddd",
                            fontSize: "15px",
                          }}
                        >
                          
Created By

                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            textAlign: "center",
                            border: "1px solid #ddd",
                            fontSize: "15px",
                          }}
                        >
                          
File Name

                        </TableCell>
                        
                        <TableCell
                          align="center"
                          sx={{
                            textAlign: "center",
                            border: "1px solid #ddd",
                            fontSize: "15px",
                          }}
                        >
                          Created Date

                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            textAlign: "center",
                            border: "1px solid #ddd",
                            fontSize: "15px",
                          }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {fileDetails
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((detail, index) => (
                          <TableRow
                            key={index}
                            sx={{ height: "5px", padding: "0px 16px" }}
                          >
                            
                            <TableCell
                              align="center"
                              sx={{
                                textAlign: "center",
                                borderRight: "1px solid #ddd",
                              }}
                            >
                              {detail.createdById}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                textAlign: "center",
                                borderRight: "1px solid #ddd",
                              }}
                            >
                              {detail.createdByName}
                            </TableCell>

                            <TableCell
                              sx={{
                                textAlign: "center",
                                borderRight: "1px solid #ddd",
                              }}
                            >
                              {detail.fileDoc.name}
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "center",
                                borderRight: "1px solid #ddd",
                              }}
                            >{detail.createdDate}</TableCell>
                              <TableCell
                              align="center"
                              sx={{
                                textAlign: "center",
                                borderRight: "1px solid #ddd",
                              }}
                            >
                              <div style={{ display: "flex" }}>
                                <IconButton
                                  component={"span"}
                                  sx={{ m: 0 }}
                                  aria-label="edit"
                                  color="primary"
                                  onClick={() => handleDownload(detail._id)}
            
                                >
                                 <FileDownloadIcon/>
                                </IconButton>
                                <IconButton
                                  sx={{ m: 0 }}
                                  aria-label="delete"
                                  color="error"
                                  onClick={() => handleClickOpen(detail._id)}
                                >
                                  <DeleteIcon />
                                </IconButton>

                              </div>
                              
                            </TableCell>
                           
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                m={2}
              >
                <Grid sx={{ mt: 2 }}>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 75, 100]}
                    component="div"
                    count={fileDetails.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  ></TablePagination>
                </Grid>
              </Stack>
            </Paper>
          </Container>
          <Dialog
                            open={open}
                            // onClose={handleClose}
                            aria-describedby="alert-dialog-slide-description"
                          >
                            <DialogTitle>{"DELETE"}</DialogTitle>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-slide-description">
                                Are you sure you want to delete file?
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={() => {deleteData(users1);setOpen(false);fetchDetails();}}>
                                Delete
                              </Button>
                              <Button onClick={handleClose}>Cancel</Button>
                            </DialogActions>
                          </Dialog>
        </>
      )}
    
    </>
  );
}

export default ManageFile;
