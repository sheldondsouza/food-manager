import React from 'react';
import './InstructionModal.css';

const InstructionModal = ({ instructions, setInstructions, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="instruction-modal">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h3>Add Cooking instructions</h3>
        <textarea
          placeholder="Type your cooking instructions here..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
        <p className="note">The restaurant will try its best to follow your request. However, refunds or cancellations in this regard won’t be possible.</p>

        <div className="modal-actions">
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="next" onClick={onClose}>Next</button>
        </div>
      </div>

    </div>
  );
};

export default InstructionModal;
