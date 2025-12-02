import { FC } from "react";
import { BsX } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";

interface Props{
    modalStatus : boolean
}

const AppoinmentModal: FC<Props> = ({modalStatus})=>{
    return(
        <div className = {`flex justify-around bg-white absolute left-[32%] top-6 w-[30vw] text-xl items-center py-2 rounded-md border-2 ${modalStatus ? 'border-green-500' : 'border-red-600'}`}>
            {modalStatus ? <FaCheck className = "text-green-500 size-6"/> : <BsX className = "text-red-600 size-10"/>}
            {modalStatus ? "Se eliminó exitosamente." : "ERROR: No se pudo eliminar."}
        </div>
    );
}

export default AppoinmentModal;