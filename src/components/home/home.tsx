import React, { useState, useEffect } from 'react';
import axios from 'axios';

type Department = {
    id: number;
    name: string;
};

type Student = {
    id: number;
    name: string;
    department_id: number;
};

const App: React.FC = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);

    useEffect(() => {
        // Fetch all departments
        axios.get('http://localhost:3000/departments').then((response) => {
            setDepartments(response.data);
        });
    }, []);

    const handleCheckboxChange = (departmentId: number) => {
        if (selectedDepartmentId === departmentId) {
            setSelectedDepartmentId(null); // Unselect
            setStudents([]);
        } else {
            setSelectedDepartmentId(departmentId); // Select and fetch students
            axios.get(`http://localhost:3000/students/${departmentId}`).then((response) => {
                setStudents(response.data);
            });
        }
    };

    return (
        <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
                {/* Department Table */}
                <div>
                    <h2 className="text-lg font-bold mb-2">Departments</h2>
                    <table className="table-auto w-full border-collapse border border-gray-200">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((department) => (
                                <tr key={department.id}>
                                    <td className="border border-gray-300 px-4 py-2">{department.name}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedDepartmentId === department.id}
                                            onChange={() => handleCheckboxChange(department.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Students Table */}
                <div>
                    <h2 className="text-lg font-bold mb-2">Students</h2>
                    <table className="table-auto w-full border-collapse border border-gray-200">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id}>
                                    <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default App;
