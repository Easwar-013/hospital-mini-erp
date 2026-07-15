import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import {
  getReceptionists,
  deleteReceptionist,
} from "../../services/receptionistService";
import AddReceptionistModal from "../../components/Receptionists/AddReceptionistModal";
import EditReceptionistModal from "../../components/Receptionists/EditReceptionistModal";
import "./Receptionists.css";

const Receptionists = () => {
  const [receptionists, setReceptionists] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedReceptionist, setSelectedReceptionist] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchReceptionists();
  }, []);

  const fetchReceptionists = async () => {
    try {
      const response = await getReceptionists();
      const data = Array.isArray(response.data) ? response.data : [];
      setReceptionists(data);
    } catch (err) {
      console.error("Fetch error:", error);
      setReceptionists([]);
      toast.error("Failed to fetch receptionists");
    }
  };

  const handleEdit = (receptionist) => {
    console.log("Edit clicked for:", receptionist);
    setSelectedReceptionist(receptionist);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this receptionist?")) {
      try {
        await deleteReceptionist(id);
        toast.success("Receptionist deleted successfully");
        fetchReceptionists();
      } catch (err) {
        toast.error("Failed to delete receptionist");
      }
    }
  };

  const filteredReceptionists = receptionists.filter((r) => {
    // r.name is what you saved in the backend (mapped from fullName)
    const name = r?.name || "";
    const email = r?.email || "";
    const searchLower = search.toLowerCase();
    return (
      name.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-box">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>Manage Receptionists</h3>
          <button
            className="add-btn"
            onClick={() => setIsModalOpen(true)} // Open Modal
          >
            <FaPlus /> Add Receptionist
          </button>
        </div>

        {/* Modal Logic */}
        {isModalOpen && (
          <AddReceptionistModal
            onClose={() => setIsModalOpen(false)}
            onAdd={() => {
              fetchReceptionists();
              setIsModalOpen(false);
            }}
          />
        )}

        {/* Edit Modal Logic */}
        {isEditModalOpen && selectedReceptionist && (
          <EditReceptionistModal
            receptionist={selectedReceptionist}
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={() => {
              fetchReceptionists();
              setIsEditModalOpen(false);
            }}
          />
        )}

        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search receptionist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReceptionists.map((r) => (
              <tr key={r._id}>
                <td>{r._id.slice(-6)}</td>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.phone || "N/A"}</td>
                <td>
                  <span
                    className={`badge ${r.status === "Active" ? "available" : "inactive"}`}
                  >
                    {r.status || "Active"}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(r)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(r._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Receptionists;
