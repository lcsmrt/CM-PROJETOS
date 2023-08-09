import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, ClickAwayListener, IconButton, Stack, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import MaskedTextField from "./MaskedTextField";

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
}

interface Dados {
  [key: string]: any;
}

interface StickyHeadTableProps {
  columns: Coluna[];
  data: Dados[];
  title?: string;
  mode: "add" | "edit" | "view";
  handleRowClick?: (rowId: number) => void;
  handleVisualize?: (rowId: number) => void;
  handleAdd: () => void;
  handleEdit: () => void;
  handleDataChange: (value: any, rowId: number, columnId: string) => void;
  handleSave: (rowId: number) => void;
  handleCancel: () => void;
  handleDelete: (rowId: number) => void;
  maxHeight?: string;
  minHeight?: string;
  hideVisualizeButton?: boolean;
  hideAddButton?: boolean;
}

const StickyHeadTable: React.FC<StickyHeadTableProps> = ({ ...props }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [selectedRowId, setSelectedRowId] = React.useState<number | string | null>(null);

  const handleRowClick = (id: number) => {
    if (props.mode === "view") {
      setSelectedRowId(id);
    }
  };

  const handleClickAway = () => {
    if (props.mode === "view") {
      setSelectedRowId(null)
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
        {props.title &&
          <Typography
            variant="h1"
            fontSize="18px"
            margin="1% 0 1% 1.2%">
            {props.title}
          </Typography>}
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
                      paddingTop: "0.9%",
                      paddingBottom: "0.9%",
                      fontSize: "13px",
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
                              console.log(row.id)
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
                                  paddingTop: "0.8%",
                                  paddingBottom: "0.8%",
                                  fontSize: "12px"
                                }}
                              >
                                {props.mode !== "view" && selectedRowId === row.id && !column.readonly ? (
                                  column.maskType ? (
                                    <MaskedTextField
                                      maskType={column.maskType}
                                      customMask={column.customMask}
                                      name={column.id}
                                      value={value}
                                      onChange={(event) => props.handleDataChange(event.target.value, row.id, column.id)}
                                      size="small"
                                      variant="standard"
                                      sx={{ minWidth: (column.minWidth ? column.minWidth - 4 : column.minWidth), maxWidth: (column.maxWidth ? column.maxWidth - 4 : column.maxWidth) }}
                                      fullWidth
                                    />
                                  ) : (
                                    <TextField
                                      size="small"
                                      variant="standard"
                                      color="primary"
                                      value={value}
                                      onChange={(event) => props.handleDataChange(event.target.value, row.id, column.id)}
                                      sx={{ minWidth: (column.minWidth ? column.minWidth - 4 : column.minWidth), maxWidth: (column.maxWidth ? column.maxWidth - 4 : column.maxWidth) }}
                                      InputProps={{ sx: { fontSize: "12px" } }}
                                      fullWidth
                                    />
                                  )
                                ) :
                                  column.format
                                    ? column.format(value)
                                    : value
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
            <IconButton
              size="large"
              color="success"
              onClick={() => {
                props.handleAdd();
                setSelectedRowId("")
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Stack>}
      {selectedRowId !== null && props.mode === "view" &&
        <Stack
          margin={"0.2% 0 0.2% 0.4%"}
          justifyContent="space-between" >
          <Box
            width={0}>
            {!props.hideVisualizeButton &&
              <IconButton
                size="large"
                sx={{ marginBottom: 1 }}
                onClick={(event) => {
                  event.stopPropagation();
                  if (props.handleVisualize) {
                    props.handleVisualize(selectedRowId as number);
                  }
                }}>
                <VisibilityIcon
                  fontSize="small" />
              </IconButton>
            }
            <IconButton
              size="large"
              onClick={(event) => {
                event.stopPropagation();
                props.handleEdit();
              }}>
              <EditIcon
                fontSize="small" />
            </IconButton>
          </Box>
          <Box
            width={0}>
            <IconButton
              size="large"
              color="error"
              onClick={(event) => {
                event.stopPropagation();
                props.handleDelete(selectedRowId as number);
              }}>
              <DeleteIcon
                fontSize="small" />
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
              size="large"
              sx={{ marginBottom: 1 }}
              onClick={(event) => {
                event.stopPropagation();
                props.handleSave(selectedRowId as number)
              }}>
              <SaveIcon
                fontSize="small" />
            </IconButton>
            <IconButton
              size="large"
              color="error"
              onClick={(event) => {
                event.stopPropagation();
                props.handleCancel();
                setSelectedRowId(null)
              }}>
              <CloseIcon
                fontSize="small" />
            </IconButton>
          </Box>
        </Stack>
      }
    </Stack>
  );
}

export default StickyHeadTable;