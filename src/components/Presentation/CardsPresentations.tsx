import React,{FC, useEffect} from 'react'
import { TablePresentationsProps } from './TablePresentations'
import CardPresentation from './CardPresentation';

const CardsPresentations:FC<TablePresentationsProps> = ({dataPresentations, setPresentationActive, nickNameUser}) => {
  useEffect(() => {
    console.log('Cards dataPresentations:',dataPresentations);
    console.log('Cards nickNameUser:',nickNameUser);
  }, [dataPresentations]);
  return (
    <div
    style={{
      marginTop:'30px',
      marginBottom:'100px',
      display:'flex',
      flexWrap:'wrap',
      justifyContent:'space-around',
      gap:'20px'
    }}
    >
      {dataPresentations.map((presentation) => {
        return (
          <CardPresentation 
          key={presentation._id} 
          dataPresentation={presentation} 
          setPresentationActive={setPresentationActive}
          nickNameUser={nickNameUser}
          />
        )
      }
      )}
    </div>
  )
}

export default CardsPresentations