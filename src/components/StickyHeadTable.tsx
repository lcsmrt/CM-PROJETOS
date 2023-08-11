import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, ClickAwayListener, Fade, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MaskedTextField from "./MaskedTextField";
import { useNavigate } from "react-router-dom";
import ComboBox, { IComboBox } from "./ComboBox";

export interface Coluna {
  id: string;
  label: string;
  readonly?: boolean;
  minWidth?: number;
  maxWidth?: number;
  align?: "right";
  maskType?: "date" | "money" | "custom";
  customMask?: string;
  format?: (value: number | string) => string;
  comboBoxProps?: IComboBox
}

interface Dados {
  [key: string]: any;
}

interface IStickyHeadTable {
  columns: Coluna[];
  data: Dados[];
  title?: string;
  mode: "add" | "edit" | "view";

  handleRowClick?: (rowId: number) => void;
  handleClickAway?: () => void;
  handleVisualize?: (rowId: number) => void;
  handleAdd: () => void;
  handleEdit: (rowId: number) => void;
  handleDataChange: (value: any, rowId: number, columnId: string) => void;
  handleSave: (rowId: number) => void;
  handleCancel: () => void;
  handleDelete: (rowId: number) => void;
  handleFileUpload?: (file: File, rowId: number) => void;
  handleFileDownload?: (rowId: number) => void;

  maxHeight?: string;
  minHeight?: string;

  hasVisualizeButton?: boolean;
  hasAddButton?: boolean;
  hasBackButton?: boolean;
  hasFile?: boolean
}

const StickyHeadTable: React.FC<IStickyHeadTable> = ({ ...props }) => {
  const navigate = useNavigate();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [selectedRowId, setSelectedRowId] = React.useState<number | string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const goToPreviousPage = () => {
    navigate(-1);
  }

  const handleRowClick = (id: number) => {
    if (props.mode === "view") {
      setSelectedRowId(id);
    }
  };

  const handleClickAway = () => {
    if (props.mode === "view") {
      setSelectedRowId(null);
      if (props.handleClickAway) {
        props.handleClickAway();
      }
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Stack direction="row">
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden"
        }}>
        {
          props.title && (
            props.hasBackButton ? (
              <Stack
                direction="row"
                alignItems="center"
                paddingLeft={"10px"}
                sx={{ backgroundColor: "ForestGreen", color: "White" }}
                height={"45px"}>
                <IconButton color="inherit" onClick={goToPreviousPage}>
                  <ArrowBackIcon color="inherit" fontSize="small" />
                </IconButton>
                <Typography
                  variant="h1"
                  fontSize="20px"
                  marginLeft="10px">
                  {props.title}
                </Typography>
              </Stack>
            ) : (
              <Stack
                direction="row"
                alignItems="center"
                paddingLeft={"56px"}
                sx={{ backgroundColor: "ForestGreen", color: "White" }}
                height={"45px"}>
                <Typography
                  variant="h1"
                  fontSize="20px"
                  color="inherit">
                  {props.title}
                </Typography>
              </Stack>
            )
          )
        }
        <TableContainer
          sx={{
            maxHeight: props.maxHeight ?? "72vh",
            minHeight: props.minHeight ?? "30vh"
          }}>
          <Table
            stickyHeader
            aria-label="sticky table">
            <TableHead>
              <TableRow>
                {props.columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sx={{
                      maxWidth: column.maxWidth,
                      minWidth: column.minWidth,
                      paddingTop: "6px",
                      paddingBottom: "6px",
                      fontSize: "13px",
                      height: "45px"
                    }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <ClickAwayListener onClickAway={() => handleClickAway()}>
              <TableBody>
                {
                  props.data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={row.id as string}
                          onClick={() => {
                            handleRowClick(row.id as number)
                            if (props.handleRowClick) {
                              props.handleRowClick(row.id as number);
                            }
                          }}
                          selected={selectedRowId === row.id ? true : false}>
                          {props.columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                sx={{
                                  maxWidth: column.maxWidth,
                                  minWidth: column.minWidth,
                                  paddingTop: "9px",
                                  paddingBottom: "9px",
                                  fontSize: "12px"
                                }}
                              >
                                {
                                  props.mode !== "view" && selectedRowId === row.id && !column.readonly ? (
                                    column.maskType ? (
                                      <MaskedTextField
                                        maskType={column.maskType}
                                        customMask={column.customMask}
                                        name={column.id}
                                        value={value}
                                        onChange={(event) => props.handleDataChange(event.target.value, row.id, column.id)}
                                        size="small"
                                        variant="standard"
                                        sx={{ minWidth: (column.minWidth ? column.minWidth - 5 : column.minWidth), maxWidth: (column.maxWidth ? column.maxWidth - 5 : column.maxWidth) }}
                                        fontSize="12px"
                                        fullWidth
                                      />
                                    ) : column.comboBoxProps ? (
                                      <ComboBox
                                        options={column.comboBoxProps.options}
                                        displayKey={column.comboBoxProps.displayKey}
                                        valueKey={column.comboBoxProps.valueKey}
                                        value={column.comboBoxProps.value}
                                        onChange={column.comboBoxProps.onChange}
                                        size="small"
                                        variant="standard"
                                        sx={{ minWidth: (column.minWidth ? column.minWidth - 5 : column.minWidth), maxWidth: (column.maxWidth ? column.maxWidth - 5 : column.maxWidth) }}
                                        fontSize="12px"
                                        fullWidth
                                      />
                                    ) : (
                                      <TextField
                                        size="small"
                                        variant="standard"
                                        color="primary"
                                        value={value}
                                        onChange={(event) => props.handleDataChange(event.target.value, row.id, column.id)}
                                        sx={{ minWidth: (column.minWidth ? column.minWidth - 5 : column.minWidth), maxWidth: (column.maxWidth ? column.maxWidth - 5 : column.maxWidth) }}
                                        InputProps={{ sx: { fontSize: "12px" } }}
                                        fullWidth
                                      />
                                    )
                                  ) : column.minWidth && column.minWidth > 160 ? (
                                    <Tooltip
                                      title={column.format
                                        ? column.format(value)
                                        : value}
                                      TransitionComponent={Fade}
                                      TransitionProps={{ timeout: 1000 }}>
                                      <div style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100%"
                                      }}>
                                        {column.format
                                          ? column.format(value)
                                          : value}
                                      </div>
                                    </Tooltip>) : (
                                    <>
                                      {
                                        column.format
                                          ? column.format(value)
                                          : value
                                      }
                                    </>
                                  )
                                }
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })
                }
              </TableBody>
            </ClickAwayListener>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={props.data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from} - ${to} de ${count !== -1 ? count : `mais de ${to}`}`}
        />
      </Paper>
      {selectedRowId === null &&
        <Stack
          margin={"0.2% 0 0.2% 0.4%"}
          justifyContent="start" >
          <Box
            width={0}>
            {props.hasAddButton &&
              <IconButton
                size="medium"
                color="success"
                onClick={() => {
                  props.handleAdd();
                  setSelectedRowId("")
                }}
              >
                <AddCircleIcon fontSize="medium" />
              </IconButton>
            }
          </Box>
        </Stack>}
      {selectedRowId !== null && props.mode === "view" &&
        <Stack
          margin={"0.2% 0 0.2% 0.4%"}
          justifyContent="space-between" >
          <Box
            width={0}>
            {props.hasVisualizeButton &&
              <IconButton
                size="medium"
                sx={{ marginBottom: 1 }}
                onClick={(event) => {
                  event.stopPropagation();
                  if (props.handleVisualize) {
                    props.handleVisualize(selectedRowId as number);
                  }
                }}>
                <VisibilityIcon
                  fontSize="medium" />
              </IconButton>
            }
            <IconButton
              size="medium"
              onClick={(event) => {
                event.stopPropagation();
                props.handleEdit(selectedRowId as number);
              }}>
              <EditIcon
                fontSize="medium" />
            </IconButton>
            {props.hasFile &&
              <>
                <>
                  <IconButton
                    size="medium"
                    onClick={(event) => {
                      event.stopPropagation();
                      fileInputRef.current?.click();
                    }}>
                    <AttachFileIcon
                      fontSize="medium" />
                  </IconButton>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file && props.handleFileUpload) {
                        props.handleFileUpload(file, selectedRowId as number);
                      }
                    }}
                  />
                </>
                <IconButton
                  size="medium"
                  onClick={(event) => {
                    event.stopPropagation();
                    if (props.handleFileDownload) {
                      props.handleFileDownload(selectedRowId as number);
                    }
                  }}>
                  <FileDownloadIcon
                    fontSize="medium" />
                </IconButton>
              </>
            }
          </Box>
          <Box
            width={0}>
            <IconButton
              size="medium"
              color="error"
              onClick={(event) => {
                event.stopPropagation();
                props.handleDelete(selectedRowId as number);
              }}>
              <DeleteIcon
                fontSize="medium" />
            </IconButton>
          </Box>
        </Stack>
      }
      {selectedRowId !== null && props.mode !== "view" &&
        <Stack
          margin={"0.2% 0 0.2% 0.4%"}>
          <Box
            width={0}>
            <IconButton
              size="medium"
              sx={{ marginBottom: 1 }}
              onClick={(event) => {
                event.stopPropagation();
                props.handleSave(selectedRowId as number)
              }}>
              <SaveIcon
                fontSize="medium" />
            </IconButton>
            <IconButton
              size="medium"
              color="error"
              onClick={(event) => {
                event.stopPropagation();
                props.handleCancel();
                setSelectedRowId(null)
              }}>
              <CancelIcon
                fontSize="medium" />
            </IconButton>
          </Box>
        </Stack>
      }
    </Stack>
  );
}

export default StickyHeadTable;