import { useState } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

import { deleteWard } from "../../services/wardService";

import "./WardTable.css";

const WardTable = ({ wards, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ward assignment?",
    );

    if (!confirmDelete) return;

    try {
      await deleteWard(id);

      toast.success("Ward Assignment Deleted Successfully");

      onDelete();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete Failed");
    }
  };

  const filteredWards = wards.filter((ward) => {
    const keyword = search.toLowerCase();

    return (
      ward.patient?.fullName?.toLowerCase().includes(keyword) ||
      ward.doctor?.fullName?.toLowerCase().includes(keyword) ||
      ward.wardName?.toLowerCase().includes(keyword) ||
      ward.bedNumber?.toLowerCase().includes(keyword) ||
      ward.status?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="patient-table">
      <div className="table-header">
        <div className="search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search ward..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Responsive Wrapper */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Ward</th>
              <th>Bed</th>
              <th>Admission Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredWards.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Ward Assignments Found
                </td>
              </tr>
            ) : (
              filteredWards.map((ward) => (
                <tr key={ward._id}>
                  <td>{ward.patient?.fullName}</td>

                  <td>{ward.doctor?.fullName}</td>

                  <td>{ward.wardName}</td>

                  <td>{ward.bedNumber}</td>

                  <td>{ward.admissionDate}</td>

                  <td>
                    <span
                      className={
                        ward.status === "Occupied"
                          ? "status admitted"
                          : ward.status === "Available"
                            ? "status discharged"
                            : "status pending"
                      }
                    >
                      {ward.status}
                    </span>
                  </td>

                  <td>
                    <button className="edit" onClick={() => onEdit(ward)}>
                      <FaEdit />
                    </button>

                    <button
                      className="delete"
                      onClick={() => handleDelete(ward._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WardTable;
