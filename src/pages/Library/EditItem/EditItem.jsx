import { useParams } from "react-router-dom"
function EditItem() {
  const {id}= useParams();
  return (
  <h2>{id}</h2>
  );
}

export default EditItem
