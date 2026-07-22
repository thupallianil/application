import { User, Mail, Phone, Building2 } from "lucide-react";

export default function Profile() {

  const user = {
    name: "Admin User",
    email: "admin@example.com",
    phone: "+91 9876543210",
    company: "ABC Pvt Ltd",
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        My Profile
      </h1>

      <div className="space-y-6">

        <div className="flex gap-4 items-center">
          <User className="text-blue-600" />
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-semibold">{user.name}</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Mail className="text-blue-600" />
          <div>
            <p className="text-gray-500">Email</p>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Phone className="text-blue-600" />
          <div>
            <p className="text-gray-500">Phone</p>
            <p>{user.phone}</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Building2 className="text-blue-600" />
          <div>
            <p className="text-gray-500">Company</p>
            <p>{user.company}</p>
          </div>
        </div>

      </div>

    </div>
  );
}