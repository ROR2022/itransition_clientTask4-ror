import { FC, useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Button, IconButton } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalConfirm from "./ModalConfirm";
import { updateActiveUsers, deleteUsers } from "@/api/apiUser";
import { useSelector } from "react-redux";
import "./DataTable.css";
import { DataUser } from "@/redux/userSlice";
import { RootState } from "@/redux/store";
import { UserFromDB } from "./Admin";

const columns: GridColDef[] = [
  { field: "id", headerName: "Id", width: 70 },
  { field: "name", headerName: "Name", width: 130 },
  { field: "email", headerName: "Email", width: 130 },
  {
    field: "lastLogin",
    headerName: "Last Login",
    width: 90,
  },
  {
    field: "registerTime",
    headerName: "Register Time",
    width: 160,
  },
  {
    field: "active",
    headerName: "Active",
    width: 90,
  },
];

const rowsTMP = [
  {
    id: "1",
    name: "Snow",
    email: "snow@email.com",
    lastLogin: new Date("2021-10-10"),
    registerTime: new Date("2021-10-10"),
    active: true,
  },
  {
    id: "2",
    name: "Cersei",
    email: "cersei@email.com",
    lastLogin: new Date("2021-10-10"),
    registerTime: new Date("2021-10-10"),
    active: true,
  },
  {
    id: "3",
    name: "Jamie",
    email: "jamie@email.com",
    lastLogin: new Date("2021-10-10"),
    registerTime: new Date("2021-10-10"),
    active: true,
  },
];

const paginationModel = { page: 0, pageSize: 5 };

interface DataTableProps {
  dataUsers: DataUser[];
  handleReload: () => void;
}
interface DataModalProps {
  title: string;
  description: string;
}

const dataModalDefault: DataModalProps = {
  title: "",
  description: "",
};

const DataTable: FC<DataTableProps> = ({ dataUsers, handleReload }) => {
  const [selectionModel, setSelectionModel] = useState<Array<string>>([]);
  const [rows, setRows] = useState<Array<DataUser>>(rowsTMP);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataModal, setDataModal] = useState<DataModalProps>(dataModalDefault);
  const [action, setAction] = useState<string>("");
  const user:DataUser = useSelector((state: RootState) => state.user);
  const { access_token } = user;

  useEffect(() => {}, [selectionModel]);

  useEffect(() => {
    parseDataUsers();
  }, [dataUsers]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirmModal = async () => {
    setOpenModal(false);
    console.log("Action Confirmed:", action);
    console.log("SelectionModel:", selectionModel);
    try {
      if (action === "block") {
        const tempUsers = selectionModel.map((user: string) => {
          return {
            id: user,
            active: false,
          };
        });
        const result = await updateActiveUsers(access_token, tempUsers);
        console.log("Result block:", result);
        handleReload();
      } else if (action === "unblock") {
        const tempUsers = selectionModel.map((user: string) => {
          return {
            id: user,
            active: true,
          };
        });
        const result = await updateActiveUsers(access_token, tempUsers);
        console.log("Result unblock:", result);
        handleReload();
      } else if (action === "delete") {
        const result = await deleteUsers(access_token, selectionModel);
        console.log("Result delete:", result);
        handleReload();
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const parseDataUsers = () => {
    const data = dataUsers.map((user: UserFromDB) => {
      return {
        id: user._id,
        name: user.username,
        email: user.email,
        lastLogin: user.lastLogin,
        registerTime: user.createdAt,
        active: user.active,
      };
    });
    setRows(data);
  };

  const handleSelection = (newSelection: Array<string>) => {
    //console.log("NewSelection:", newSelection);
    setSelectionModel([...newSelection]);
  };
  const handleBlock = () => {
    //console.log("Block:", selectionModel);
    setOpenModal(true);
    setAction("block");
    setDataModal({
      title: "Block User",
      description: "Are you sure to block user(s)?",
    });
  };
  const handleUnblock = () => {
    //console.log("Unblock:", selectionModel);
    setOpenModal(true);
    setAction("unblock");
    setDataModal({
      title: "Unblock User",
      description: "Are you sure to unblock user(s)?",
    });
  };
  const handleDelete = () => {
    //console.log("Delete:", selectionModel);
    setOpenModal(true);
    setAction("delete");
    setDataModal({
      title: "Delete User",
      description: "Are you sure to delete user(s)?",
    });
  };
  return (
    <>
      {openModal && (
        <ModalConfirm
          open={openModal}
          handleClose={handleCloseModal}
          handleConfirm={handleConfirmModal}
          title={dataModal.title}
          description={dataModal.description}
        />
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          marginBottom: 10,
        }}
      >
        <Button
          variant="contained"
          color="error"
          startIcon={<BlockIcon />}
          sx={{ mr: 2 }}
          disabled={selectionModel.length === 0 ? true : false}
          onClick={handleBlock}
        >
          Block
        </Button>

        <IconButton
          disabled={selectionModel.length === 0 ? true : false}
          onClick={handleUnblock}
          color="primary"
          aria-label="Unblock"
        >
          <LockOpenIcon />
        </IconButton>

        <IconButton
          disabled={selectionModel.length === 0 ? true : false}
          onClick={handleDelete}
          color="secondary"
          aria-label="Delete"
        >
          <DeleteIcon />
        </IconButton>
      </div>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
          onRowSelectionModelChange={handleSelection}
          getRowClassName={(params) =>
            params.row.active === false ? "inactive-row" : ""
          }
        />
      </Paper>
    </>
  );
};

export default DataTable;
