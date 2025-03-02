import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdOutlineCreateNewFolder, MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/alert-dialog";

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

  return (
    <div className="p-6 md:p-8 lg:p-10 h-screen bg-gray-50 flex flex-col gap-6">
      {/* Department Table */}
      <div className="h-1/2 overflow-y-auto border rounded-lg bg-white shadow-md">
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
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Department Name
                  </Label>
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Department Code
                  </Label>
                  <Input id="username" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Head of department
                  </Label>
                  <Input id="username" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Description
                  </Label>
                  <Textarea id="username" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Department</Button>
              </DialogFooter>
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
              <TableRow key={department.id} className={idx % 2 === 1 ? "bg-gray-50" : "bg-white"}>
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
                        <AlertDialogAction>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <FaRegEdit className="text-2xl cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
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
                            defaultValue={department.description}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Students Table */}
      <div className="h-1/2 overflow-y-auto border rounded-lg bg-white shadow-md">
        <div className="text-lg font-semibold mb-4 text-gray-800 px-4 pt-4 text-center">
          List of Students ({students.length})
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
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <FaRegEdit className="text-2xl cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Department Info</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Student Name
                          </Label>
                          <Input
                            id="name"
                            defaultValue={student.student_name}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Department Code
                          </Label>
                          <Input
                            id="username"
                            defaultValue={student.email}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Head of department
                          </Label>
                          <Input
                            id="username"
                            defaultValue={student.gender}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Gender
                          </Label>
                          <Textarea
                            id="username"
                            defaultValue={student.gender}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
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
