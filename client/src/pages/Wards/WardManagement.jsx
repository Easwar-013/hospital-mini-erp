import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import "./WardManagement.css";

import WardTable from "../../components/wards/WardTable";
import AddWardModal from "../../components/wards/AddWardModal";

import { getWards } from "../../services/wardService";

const WardManagement = () => {
  const [wards, setWards] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);

  const fetchWards = async () => {
    try {
      const data = await getWards();
      setWards(data);
    } catch (error) {
      toast.error("Failed to load ward assignments");
    }
  };

  useEffect(() => {
    fetchWards();
  }, []);

  return (
    <div className="wards-page">
      <div className="page-header">
        <div>
          <h1>Ward Management</h1>
          <p>Manage patient ward assignments.</p>
        </div>

        <button
          className="add-btn"
          onClick={() => {
            setSelectedWard(null);
            setOpenModal(true);
          }}
        >
          <FaPlus />
          Assign Ward
        </button>
      </div>

      <WardTable
        wards={wards}
        onEdit={(ward) => {
          setSelectedWard(ward);
          setOpenModal(true);
        }}
        onDelete={fetchWards}
      />

      <AddWardModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedWard(null);
        }}
        selectedWard={selectedWard}
        onWardSaved={fetchWards}
      />
    </div>
  );
};

export default WardManagement;
