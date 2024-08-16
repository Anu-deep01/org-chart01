import React, { useState } from 'react';

const SubordinateActions = ({ onAddSubordinate, onAddBranchMember, canCreate }) => (
	<div className="flex justify-center mt-2">
		{canCreate && (
			<>
				<button onClick={onAddSubordinate} className="bg-green-500 text-white p-1 rounded mx-1">Add Subordinate</button>
				<button onClick={onAddBranchMember} className="bg-yellow-500 text-white p-1 rounded mx-1">Add Branch</button>
			</>
		)}
	</div>
);

const Branch = ({ label, level = 1, isDirector = false, onDelete, onDeletePeer, connectToGrandparent }) => {
	const [subordinates, setSubordinates] = useState([]);
	const [peers, setPeers] = useState([]);

	const handleAddSubordinate = () => {
		const newSubordinateLabel = `Subordinate${label !== 'Director' ? `/${label.split('/').pop()}` : ''}/${subordinates.length + 1}`;
		setSubordinates([...subordinates, newSubordinateLabel]);
	};

	const handleAddPeer = () => {
		const newPeerLabel = `Branch member${label !== 'Director' ? `/${label.split('/').pop()}` : ''}/${peers.length + 1}`;
		setPeers([...peers, newPeerLabel]);
	};

	const handleDeleteSubordinate = (labelToDelete) => {
		setSubordinates(subordinates.filter(sub => sub !== labelToDelete));
	};

	const handleDeletePeer = (labelToDelete) => {
		setPeers(peers.filter(peer => peer !== labelToDelete));
	};

	const handleDeleteBranch = (labelToDelete) => {
		if (onDelete) {
			connectToGrandparent(subordinates);
			onDelete(labelToDelete);
		}
	};

	const canCreate = level === 1 || (label.split('/').length === level);

	return (
		<div className="flex flex-col items-center">
			<div className="flex flex-col items-center mb-8">
				<div className={`p-4 shadow rounded ${isDirector ? 'border-4 border-blue-500 bg-blue-100' : label.startsWith('Subordinate') ? 'border-2 border-green-500 bg-green-100' : 'border-2 border-yellow-500 bg-yellow-100'}`}>
					<i className={`${isDirector ? 'fas fa-crown text-blue-500' : label.startsWith('Subordinate') ? 'fas fa-user text-green-500' : 'fas fa-user-friends text-yellow-500'}`}></i> <span>{label}</span>
				</div>
				{label !== "Director" && (
					<>
						<button className="mt-2 bg-red-500 text-white p-1 rounded mx-1" onClick={() => handleDeleteBranch(label)}>Delete</button>
					</>
				)}
				{isDirector && (
					<button className="mt-2 bg-blue-500 text-white p-1 rounded" onClick={handleAddSubordinate}>Add Subordinate</button>
				)}
				{!isDirector && (
					<SubordinateActions 
						onAddSubordinate={handleAddSubordinate}
						onAddBranchMember={handleAddPeer}
						canCreate={canCreate}
					/>
				)}
			</div>
			<div className="flex">
				{subordinates.map((subLabel, index) => (
					<div key={index} className="flex">
						<Branch 
							label={subLabel} 
							level={level + 1} 
							isDirector={false} 
							onDelete={handleDeleteSubordinate} 
							onDeletePeer={handleDeletePeer} 
							connectToGrandparent={(children) => setSubordinates([...subordinates.slice(0, index), ...children, ...subordinates.slice(index + 1)])}
						/>
					</div>
				))}
			</div>
			<div className="flex">
				{peers.map((peerLabel, index) => (
					<div key={index} className="flex flex-col items-center">
						<Branch 
							label={peerLabel} 
							level={level} 
							isDirector={false} 
							onDelete={handleDeleteSubordinate} 
							onDeletePeer={handleDeletePeer} 
							connectToGrandparent={(children) => setSubordinates([...peers.slice(0, index), ...children, ...peers.slice(index + 1)])}
						/>
						<button className="mt-2 bg-red-500 text-white p-1 rounded mx-1" onClick={() => handleDeletePeer(peerLabel)}>Delete Branch</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default Branch;
