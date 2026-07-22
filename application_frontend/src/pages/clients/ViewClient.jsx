import { Mail, Phone, Building2, MapPin } from "lucide-react";

export default function ViewClient() {
  const client = {
    name: "John Doe",
    email: "john@gmail.com",
    phone: "9876543210",
    company: "ABC Pvt Ltd",
    address: "Hyderabad, Telangana",
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow">

      <h1 className="text-3xl font-bold mb-8">
        Client Details
      </h1>

      <div className="space-y-6">

        <div className="flex items-center gap-4">
          <Building2 className="text-blue-600" />
          <div>
            <h2 className="font-semibold">Company</h2>
            <p>{client.company}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Mail className="text-blue-600" />
          <div>
            <h2 className="font-semibold">Email</h2>
            <p>{client.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Phone className="text-blue-600" />
          <div>
            <h2 className="font-semibold">Phone</h2>
            <p>{client.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <MapPin className="text-blue-600" />
          <div>
            <h2 className="font-semibold">Address</h2>
            <p>{client.address}</p>
          </div>
        </div>

      </div>
    </div>
  );
}