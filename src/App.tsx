import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { Toaster } from "../src/components/ui/sonner";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../src/components/ui/table";
import { MdOutlineCreateNewFolder, MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { Button } from "../src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../src/components/ui/dialog";
import { Input } from "../src/components/ui/input";
import { Label } from "../src/components/ui/label";
import { Textarea } from "./components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../src/components/ui/alert-dialog";

type Department = {
  id: number;
  department_name: string;
  department_code: number;
  head_of_department: string;
  description: string;
};

type Student = {
  id: number;
  student_name: string;
  enrollment_date: string;
  email: string;
  gender: string;
  status: string;
  department_id: number;
};

const App: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    number | null
  >(null);

  useEffect(() => {
    // Fetch all departments
    axios.get("http://localhost:5000/departments").then((response) => {
      setDepartments(response.data);
    });
  }, []);

  const handleCheckboxChange = (departmentId: number) => {
    if (selectedDepartmentId === departmentId) {
      setSelectedDepartmentId(null); // Unselect
      setStudents([]);
    } else {
      setSelectedDepartmentId(departmentId); // Select and fetch students
      axios
        .get(`http://localhost:5000/students/${departmentId}`)
        .then((response) => {
          setStudents(response.data);
        });
    }
  };

  const handleCreateDept = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const departmentData = {
      department_name:
        (form.elements.namedItem("department_name") as HTMLInputElement)
          ?.value || "",
      head_of_department:
        (form.elements.namedItem("head_of_department") as HTMLInputElement)
          ?.value || "",
      department_code:
        (form.elements.namedItem("department_code") as HTMLInputElement)
          ?.value || "",
      description:
        (form.elements.namedItem("description") as HTMLTextAreaElement)
          ?.value || "",
    };
    console.log("Department Created:", departmentData);

    const data = await axios.post(
      "http://localhost:5000/departments",
      departmentData
    );
    console.log(data);
  };

  const handleDeleteDept = async (id: number) => {
    console.log(id);
    try {
      const data = await axios.delete(
        `http://localhost:5000/departments/${id}`
      );
      console.log(data);
      toast("Department deleted");
    } catch (error) {
      toast(error?.response?.data?.error);
      // console.log(error.response.data.error);
    }
  };

  const handleEditDept = async (e: FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault();
  
    const form = e.currentTarget;
  
    const updatedDept = {
      department_name: (form.elements.namedItem("department_name") as HTMLInputElement)?.value || "",
      head_of_department: (form.elements.namedItem("head_of_department") as HTMLInputElement)?.value || "",
      department_code: (form.elements.namedItem("department_code") as HTMLInputElement)?.value || "",
      description: (form.elements.namedItem("description") as HTMLTextAreaElement)?.value || "",
    };
  
    try {
      await axios.put(`http://localhost:5000/departments/${id}`, updatedDept);
  
      setDepartments((prevDepartments) =>
        prevDepartments.map((dept) =>
          dept.id === id ? { ...dept, ...updatedDept } : dept
        )
      );
  
      toast.success("Department updated successfully!");
    } catch (error) {
      toast.error("Failed to update department.");
      console.error(error);
    }
  };
  
  
  const handleEditStudent = async (e: FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault();
  
    const form = e.currentTarget;
  
    const updatedStudent = {
      student_name: (form.elements.namedItem("student_name") as HTMLInputElement)?.value || "",
      email: (form.elements.namedItem("email") as HTMLInputElement)?.value || "",
      enrollment_date: (form.elements.namedItem("enrollment_date") as HTMLInputElement)?.value || "",
      gender: (form.elements.namedItem("gender") as HTMLInputElement)?.value || "",
    };
  
    try {
      await axios.put(`http://localhost:5000/students/${id}`, updatedStudent);
  
      // Update the student in state without refreshing
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === id ? { ...student, ...updatedStudent } : student
        )
      );
  
      toast.success("Student updated successfully!");
    } catch (error) {
      toast.error("Failed to update student.");
      console.error(error);
    }
  };
  const handleDeleteStudent = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/students/${id}`);
  
      // Remove student from state
      setStudents((prevStudents) => prevStudents.filter(student => student.id !== id));
 
      toast.success("Student deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete student.");
      console.error(error);
    }
  };
  
  

  return (
    <div className="p-6 md:p-8 lg:p-10 h-screen bg-gray-50 flex flex-col gap-6">
      {/* Department Table */}
      <Toaster />
      <div className="h-1/2 overflow-y-auto border rounded-lg bg-white ">
        <div className="text-lg flex justify-center items-center gap-4 font-semibold mb-4 text-gray-800 px-4 pt-4 text-center">
          <p>List of Departments</p>
          <Dialog>
            <DialogTrigger asChild>
              <span>
                <MdOutlineCreateNewFolder className="text-2xl cursor-pointer" />
              </span>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create a new department</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateDept}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Department Name
                    </Label>
                    <Input
                      id="name"
                      name="department_name"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Department Code
                    </Label>
                    <Input
                      id="username"
                      name="department_code"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Head of department
                    </Label>
                    <Input
                      id="username"
                      name="head_of_department"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="username"
                      name="description"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Department</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Table className="table-auto w-full">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="py-3 px-4 text-sm font-bold text-gray-700">
                Select
              </TableHead>
              <TableHead className="py-3 px-4 text-sm font-bold text-gray-700">
                Department Name
              </TableHead>
              <TableHead className="py-3 px-4 text-sm font-bold text-gray-700">
                Department Code
              </TableHead>
              <TableHead className="py-3 px-4 text-sm font-bold text-gray-700">
                Head of Department
              </TableHead>
              <TableHead className="py-3 px-4 text-sm font-bold text-gray-700">
                Description
              </TableHead>
              <TableHead className="py-3 px-4 text-sm font-bold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department, idx) => (
              <TableRow
                key={department.id}
                className={idx % 2 === 1 ? "bg-gray-50" : "bg-white"}
              >
                <TableCell className="py-2 px-4 text-sm">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectedDepartmentId === department.id}
                    onChange={() => handleCheckboxChange(department.id)}
                  />
                </TableCell>
                <TableCell className="py-2 px-4 text-sm">
                  {department.department_name}
                </TableCell>
                <TableCell className="py-2 px-4 text-sm">
                  {department.department_code}
                </TableCell>
                <TableCell className="py-2 px-4 text-sm">
                  {department.head_of_department}
                </TableCell>
                <TableCell className="py-2 px-4 text-sm">
                  {department.description.substring(0, 30)}...
                </TableCell>

                <TableCell className="py-2 px-4 flex gap-4">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <MdOutlineDelete className="text-2xl cursor-pointer" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteDept(department.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <FaRegEdit className="text-2xl cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <form onSubmit={(e) => handleEditDept(e, department.id)}>
                        <DialogHeader>
                          <DialogTitle>Edit Department Info</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Department Name
                            </Label>
                            <Input
                              id="name"
                              name="department_name"
                              defaultValue={department.department_name}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                              Department Code
                            </Label>
                            <Input
                              id="username"
                              name="department_code"
                              defaultValue={department.department_code}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                              Head of department
                            </Label>
                            <Input
                              id="username"
                              name="head_of_department"
                              defaultValue={department.head_of_department}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                              Description
                            </Label>
                            <Textarea
                              id="username"
                              name="description"
                              defaultValue={department.description}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save changes</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Students Table */}
      <div className="h-1/2 overflow-y-auto border rounded-lg bg-white ">
        <div className="text-lg font-semibold mb-4 text-gray-800 px-4 pt-4 text-center">
          <p>List of Students ({students.length})</p>
          <Dialog>
            <DialogTrigger asChild>
              <span>
                <MdOutlineCreateNewFolder className="text-2xl cursor-pointer" />
              </span>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create a new Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateDept}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Department Name
                    </Label>
                    <Input
                      id="name"
                      name="department_name"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Department Code
                    </Label>
                    <Input
                      id="username"
                      name="department_code"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Head of department
                    </Label>
                    <Input
                      id="username"
                      name="head_of_department"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="username"
                      name="description"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Student</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

        </div>
        <Table className="table-auto w-full">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="py-3 px-4 text-sm font-bold text-gray-700">
                Sr.
              </TableHead>
              <TableHead className="py-3 px-4 text-sm font-bold text-gray-700">
                Name
              </TableHead>
              <TableHead className="py-3 px-4 text-sm font-bold text-gray-700">
                Email
              </TableHead>
              <TableHead className="py-3 px-4 text-sm font-bold text-gray-700">
                Enrollment Date
              </TableHead>
              <TableHead className="py-3 px-4 text-sm font-bold text-gray-700">
                Gender
              </TableHead>
              <TableHead className="py-3 px-4 text-sm font-bold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-4 text-center text-sm text-gray-500"
                >
                  No Students to show
                </TableCell>
              </TableRow>
            ) : (
              students.map((student, idx) => (
                <TableRow key={student.id} className="hover:bg-gray-50">
                  <TableCell className="py-2 px-4 text-sm">{idx + 1}</TableCell>
                  <TableCell className="py-2 px-4 text-sm">
                    {student.student_name}
                  </TableCell>
                  <TableCell className="py-2 px-4 text-sm">
                    {student.email}
                  </TableCell>
                  <TableCell className="py-2 px-4 text-sm">
                    {student.enrollment_date}
                  </TableCell>
                  <TableCell className="py-2 px-4 text-sm">
                    {student.gender}
                  </TableCell>
                  <TableCell className="py-2 px-4 flex gap-4">
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <MdOutlineDelete className="text-2xl cursor-pointer" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the department and remove all data from
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={()=>handleDeleteStudent(student.id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <FaRegEdit className="text-2xl cursor-pointer" />
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Student Info</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => handleEditStudent(e, student.id)}>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Student Name
                              </Label>
                              <Input
                                id="name"
                                name="student_name"
                                defaultValue={student.student_name}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Email
                              </Label>
                              <Input
                                id="username"
                                name="email"
                                defaultValue={student.email}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Enrollment Date
                              </Label>
                              <Input
                                id="username"
                                name="enrollment_date"
                                defaultValue={student.enrollment_date}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Gender
                              </Label>
                              <Input
                                id="username"
                                name="gender"
                                defaultValue={student.gender}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Save changes</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default App;
