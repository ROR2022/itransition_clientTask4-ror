import React,{FC,useEffect,useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { DataModalType } from './MyTabs';
import { editSlide, deleteSlide, getPresentationById } from '@/api/apiPresentation';
import { TextField } from '@mui/material';
import { DataSlideType } from './Slide';
import { IPresentation } from './Presentation';
//import { get } from 'http';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface ModalTabsProps {
    isOpenModal: boolean;
    setIsOpenModal: (value: boolean) => void;
    dataModal: DataModalType | null;
    setSlideActive: (slide: DataSlideType | null) => void;
    setPresentationActive: (presentatio: IPresentation) => void;
    setReloadDataPresentation: (reloadDataPresentation: string | null) => void;
}

const ModalTabs:FC<ModalTabsProps>=({
    isOpenModal, setIsOpenModal,
    dataModal,
    setSlideActive,
    setPresentationActive,
    setReloadDataPresentation
})=>{
  const {action,slide} = dataModal || {};
  const [slideTitle, setSlideTitle] = useState(slide?.title);
  const [dataRes, setDataRes] = useState({
    message:'',
    error:false
  });
  const handleClose = () => {
    setIsOpenModal(false);
    setDataRes({
      message:'',
      error:false
    });
  }

  const handleDelete = async() => {
    console.log('Deleting:',slide);
    //handleClose();
    try {
        const res = await deleteSlide(slide?._id);
        console.log('deleteSlide res:',res);
        setDataRes({
          message:'Slide deleted',
          error:false
        });
        const getDataPresentationAgain = await getPresentationById(slide?.presentationId);
        setTimeout(() => {
           if(getDataPresentationAgain){
              setPresentationActive(getDataPresentationAgain);
              setReloadDataPresentation(slide?.presentationId || null);
              setSlideActive(null);
           }
            handleClose();
        }, 1000);
    } catch (error) {
        console.log('deleteSlide error:',error);
        setDataRes({
          message:'Error deleting slide',
          error:true
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }
  }

  const handleSave = async() => {
    console.log('Saving:',slide);
    try {
      const newDataSlide = {...slide,title:slideTitle};
        const res = await editSlide(slide?._id,newDataSlide);
        console.log('editSlide res:',res);
        setDataRes({
          message:'Slide updated',
          error:false
        });
        const getDataPresentationAgain = await getPresentationById(slide?.presentationId);
        setTimeout(() => {
            if(getDataPresentationAgain){
                setPresentationActive(getDataPresentationAgain);
                setReloadDataPresentation(slide?.presentationId||null);
            }
            handleClose();
        }, 1000);
    } catch (error) {
        console.log('editSlide error:',error);
        setDataRes({
          message:'Error updating slide',
          error:true
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }
    //handleClose();
  }

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlideTitle(e.target.value);
    //dataModal.slide.title = e.target.value;
  }

useEffect(() => {
    console.log('ModalTabs dataModal:',dataModal);
}, [dataModal]);
  return (
    <div>
      <Modal
        open={isOpenModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {action==='delete'?
            <span style={{color:'red'}}>Delete slide?</span>
            :
            'Edit Slide Title'}
          </Typography>
          <Typography id="modal-modal-description" variant='h4' color='info' sx={{ mt: 2,  }}>
            Title: {slide?.title}
          </Typography>
          {action==='edit' && (
            <TextField
                id="outlined-basic"
                label="Title"
                variant="outlined"
                value={slideTitle}
                onChange={handleChangeTitle}
                sx={{ mt: 2, display: 'block' }}
            />
          )}
          <Button
            onClick={handleClose}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={action==='delete'?handleDelete:handleSave}
            variant="contained"
            color="secondary"
            sx={{ mt: 2, ml: 2 }}
          >
            {action==='delete'?'Delete':'Save'}
          </Button>
          {dataRes.message && (
            <Typography id="modal-modal-description" sx={{ mt: 2,color:dataRes.error?'red':'green' }}>
              {dataRes.message}
            </Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default ModalTabs;
