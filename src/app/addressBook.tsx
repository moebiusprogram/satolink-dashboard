import { Fade } from "react-awesome-reveal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Star, Pencil, Trash, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

type Contact = {
  id: string;
  name: string;
  address: string; // LNURL address (like an email)
  isFavorite: boolean;
  lastTransactionDate?: Date;
  transactionCount: number;
  note?: string;
};

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Alice Crypto",
    address: "alice@satolink.me",
    isFavorite: true,
    lastTransactionDate: new Date(2023, 10, 15),
    transactionCount: 12,
    note: "Freelance developer payments",
  },
  {
    id: "2",
    name: "Bob Bitcoin",
    address: "bob@lightning.network",
    isFavorite: false,
    lastTransactionDate: new Date(2023, 10, 10),
    transactionCount: 5,
  },
  {
    id: "3",
    name: "Carol Coin",
    address: "carol@satolink.me",
    isFavorite: true,
    lastTransactionDate: new Date(2023, 9, 28),
    transactionCount: 8,
    note: "Coffee shop payments",
  },
  {
    id: "4",
    name: "Dave Digital",
    address: "dave@btcpay.server",
    isFavorite: false,
    lastTransactionDate: new Date(2023, 9, 15),
    transactionCount: 3,
  },
];

export default function ContactBookPage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredContacts = contacts.filter((contact) =>
    `${contact.name} ${contact.address}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = (id: string) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === id
          ? { ...contact, isFavorite: !contact.isFavorite }
          : contact
      )
    );
  };

  const handleEdit = (contact: Contact) => {
    setCurrentContact(contact);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  const handleAddNew = () => {
    setCurrentContact({
      id: "",
      name: "",
      address: "",
      isFavorite: false,
      transactionCount: 0,
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleSave = (contact: Contact) => {
    if (isEditing) {
      setContacts(
        contacts.map((c) => (c.id === contact.id ? { ...contact } : c))
      );
    } else {
      setContacts([
        ...contacts,
        {
          ...contact,
          id: Math.random().toString(36).substring(2, 9),
        },
      ]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div className="p-4 lg:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Contact Book
              </h3>
              <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>

            <div className="mb-6">
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Last Transaction</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <button
                            onClick={() => toggleFavorite(contact.id)}
                            className="text-yellow-400">
                            {contact.isFavorite ? (
                              <Star fill="yellow-400" className="h-5 w-5" />
                            ) : (
                              <Star className="h-5 w-5" />
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="font-medium">
                          {contact.name}
                          {contact.note && (
                            <p className="text-sm text-muted-foreground">
                              {contact.note}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{contact.address}</Badge>
                        </TableCell>
                        <TableCell>
                          {contact.lastTransactionDate?.toLocaleDateString() ||
                            "Never"}
                        </TableCell>
                        <TableCell>{contact.transactionCount}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(contact)}
                            className="mr-2">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(contact.id)}>
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No contacts found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Contact Edit/Add Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {isEditing ? "Edit Contact" : "Add New Contact"}
                  </DialogTitle>
                </DialogHeader>
                {currentContact && (
                  <ContactForm
                    contact={currentContact}
                    onSave={handleSave}
                    onCancel={() => setIsDialogOpen(false)}
                    isEditing={isEditing}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactForm({
  contact,
  onSave,
  onCancel,
  isEditing,
}: {
  contact: Contact;
  onSave: (contact: Contact) => void;
  onCancel: () => void;
  isEditing: boolean;
}) {
  const [formData, setFormData] = useState<Contact>(contact);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          LNURL Address (user@domain)
        </label>
        <Input
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
          title="Please enter a valid LNURL address (e.g., user@domain.com)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Note</label>
        <Input
          name="note"
          value={formData.note || ""}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="favorite"
          checked={formData.isFavorite}
          onChange={(e) =>
            setFormData({ ...formData, isFavorite: e.target.checked })
          }
          className="mr-2"
        />
        <label htmlFor="favorite" className="text-sm font-medium">
          Favorite
        </label>
      </div>
      {isEditing && (
        <div className="text-sm text-muted-foreground">
          <p>Transactions: {contact.transactionCount}</p>
          <p>
            Last transaction:{" "}
            {contact.lastTransactionDate?.toLocaleDateString() || "Never"}
          </p>
        </div>
      )}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
