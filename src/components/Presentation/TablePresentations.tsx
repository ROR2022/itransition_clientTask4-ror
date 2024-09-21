import { Box, IconButton } from '@mui/material';
import React, {FC,useState, useEffect} from 'react'
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import TablePagination from "@mui/material/TablePagination";
import TableFooter from "@mui/material/TableFooter";
import { IPresentation } from './Presentation';
import { addUserToPresentation } from '@/api/apiPresentation';


interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number
    ) => void;
  }
  
  function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }
  
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  /* interface DataPresentationType {
    _id: string;
    title: string;
    description: string;
    nickname: string;
    slides: DataSlideType[];
    users: string[];
  } */

  export interface TablePresentationsProps {
    dataPresentations: IPresentation[];
    setPresentationActive: (data: IPresentation) => void;
    nickNameUser: string;
  }

const TablePresentations:FC<TablePresentationsProps> = ({dataPresentations, setPresentationActive, nickNameUser}) => {
    const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(dataPresentations.length);
  const [rows, setRows] = useState(dataPresentations);

  useEffect(() => {
    setRows(dataPresentations);
    setRowsPerPage(dataPresentations.length);
  }, [dataPresentations]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectPresentation = async(row: IPresentation) => {
    //console.log('selected row:', row);
    if(row.nickname === nickNameUser){
      setPresentationActive(row); 
      return;
    }
    
    //es necesario checar si el usuario no es el autor de la presentacion 
    //entonces se debe agregar al usuario a la presentacion como viewer
    try {
      const res = await addUserToPresentation(row._id, nickNameUser);
      console.log('res addUserToPresentation:', res);
      const tempUsers = row.users;
      const isUser = tempUsers?.find(user=>user.nickname===nickNameUser);
      if(!isUser) row?.users?.push({nickname:nickNameUser, role:'viewer'});
      setPresentationActive(row);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        marginTop: "3rem",
        marginBottom: "8rem",
        overflowX: "auto",
      }}
    >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">ID</StyledTableCell>
            <StyledTableCell align="center">Title</StyledTableCell>
            <StyledTableCell align="center">Description</StyledTableCell>
            <StyledTableCell align="center">Author</StyledTableCell>
            </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <StyledTableRow 
            style={{
                cursor:'pointer'
            }}
            onClick={()=>handleSelectPresentation(row)}
            key={row._id}>
              <StyledTableCell align="left">{row._id}</StyledTableCell>
              <StyledTableCell align="left">{row.title}</StyledTableCell>
              <StyledTableCell align="left">{row.description}</StyledTableCell>
              <StyledTableCell align="left">{row.nickname}</StyledTableCell>
            </StyledTableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
          <TablePagination
              rowsPerPageOptions={[10,20,30,{ label: "All", value: -1 }]}
              colSpan={3}
              count={dataPresentations.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
        </Table>
        </TableContainer>
  )
}

export default TablePresentations