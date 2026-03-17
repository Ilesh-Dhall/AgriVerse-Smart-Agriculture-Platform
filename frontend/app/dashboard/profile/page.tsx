"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileData } from "@/data/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin,
  Briefcase,
  Calendar,
  Ruler,
  Sprout,
  Phone,
  Mail,
  Edit,
  Save,
  X,
} from "lucide-react";

interface UserProfile {
  name: string;
  age: string;
  profession: string;
  location: string;
  district: string;
  state: string;
  farmSize: string;
  farmType: string;
  experience: string;
  phone: string;
  email: string;
  crops: string[];
  farmingMethods: string[];
  bio: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(profileData);

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (
    field: "crops" | "farmingMethods",
    value: string[]
  ) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addCrop = (crop: string) => {
    if (crop && !editedProfile.crops.includes(crop)) {
      handleArrayChange("crops", [...editedProfile.crops, crop]);
    }
  };

  const removeCrop = (crop: string) => {
    handleArrayChange(
      "crops",
      editedProfile.crops.filter((c) => c !== crop)
    );
  };

  const addFarmingMethod = (method: string) => {
    if (method && !editedProfile.farmingMethods.includes(method)) {
      handleArrayChange("farmingMethods", [
        ...editedProfile.farmingMethods,
        method,
      ]);
    }
  };

  const removeFarmingMethod = (method: string) => {
    handleArrayChange(
      "farmingMethods",
      editedProfile.farmingMethods.filter((m) => m !== method)
    );
  };

  const currentData = isEditing ? editedProfile : profile;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your farming profile and preferences
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={handleEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage
                  src="/placeholder-avatar.jpg"
                  alt={currentData.name}
                />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {currentData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{currentData.name}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-1">
                <MapPin className="h-4 w-4" />
                {currentData.location}, {currentData.state}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{currentData.profession}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{currentData.age} years old</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                <span>{currentData.farmSize} acres farm</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Sprout className="h-4 w-4 text-muted-foreground" />
                <span>{currentData.experience} years experience</span>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{currentData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{currentData.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your basic personal and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedProfile.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">{currentData.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  {isEditing ? (
                    <Input
                      id="age"
                      type="number"
                      value={editedProfile.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                    />
                  ) : (
                    <p className="text-sm font-medium">
                      {currentData.age} years
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  {isEditing ? (
                    <Select
                      value={editedProfile.profession}
                      onValueChange={(value) =>
                        handleInputChange("profession", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Farmer">Farmer</SelectItem>
                        <SelectItem value="Agricultural Consultant">
                          Agricultural Consultant
                        </SelectItem>
                        <SelectItem value="Farm Manager">
                          Farm Manager
                        </SelectItem>
                        <SelectItem value="Agricultural Engineer">
                          Agricultural Engineer
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm font-medium">
                      {currentData.profession}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  {isEditing ? (
                    <Input
                      id="experience"
                      type="number"
                      value={editedProfile.experience}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">
                      {currentData.experience} years
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editedProfile.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">{currentData.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">{currentData.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={editedProfile.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself and your farming journey..."
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {currentData.bio}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Farm Information */}
          <Card>
            <CardHeader>
              <CardTitle>Farm Information</CardTitle>
              <CardDescription>
                Details about your farm and location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location/Village</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={editedProfile.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">
                      {currentData.location}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  {isEditing ? (
                    <Input
                      id="district"
                      value={editedProfile.district}
                      onChange={(e) =>
                        handleInputChange("district", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">
                      {currentData.district}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  {isEditing ? (
                    <Select
                      value={editedProfile.state}
                      onValueChange={(value) =>
                        handleInputChange("state", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Punjab">Punjab</SelectItem>
                        <SelectItem value="Haryana">Haryana</SelectItem>
                        <SelectItem value="Uttar Pradesh">
                          Uttar Pradesh
                        </SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                        <SelectItem value="Gujarat">Gujarat</SelectItem>
                        <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm font-medium">{currentData.state}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="farmSize">Farm Size (acres)</Label>
                  {isEditing ? (
                    <Input
                      id="farmSize"
                      type="number"
                      step="0.1"
                      value={editedProfile.farmSize}
                      onChange={(e) =>
                        handleInputChange("farmSize", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">
                      {currentData.farmSize} acres
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmType">Farm Type</Label>
                  {isEditing ? (
                    <Select
                      value={editedProfile.farmType}
                      onValueChange={(value) =>
                        handleInputChange("farmType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mixed Farming">
                          Mixed Farming
                        </SelectItem>
                        <SelectItem value="Crop Farming">
                          Crop Farming
                        </SelectItem>
                        <SelectItem value="Dairy Farming">
                          Dairy Farming
                        </SelectItem>
                        <SelectItem value="Poultry Farming">
                          Poultry Farming
                        </SelectItem>
                        <SelectItem value="Organic Farming">
                          Organic Farming
                        </SelectItem>
                        <SelectItem value="Horticulture">
                          Horticulture
                        </SelectItem>
                        <SelectItem value="Aquaculture">Aquaculture</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm font-medium">
                      {currentData.farmType}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crops & Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Crops Grown</CardTitle>
                <CardDescription>
                  Crops you currently grow or plan to grow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentData.crops.map((crop, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {crop}
                      {isEditing && (
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeCrop(crop)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Select onValueChange={addCrop}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add crop..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rice">Rice</SelectItem>
                        <SelectItem value="Wheat">Wheat</SelectItem>
                        <SelectItem value="Cotton">Cotton</SelectItem>
                        <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                        <SelectItem value="Tomato">Tomato</SelectItem>
                        <SelectItem value="Onion">Onion</SelectItem>
                        <SelectItem value="Potato">Potato</SelectItem>
                        <SelectItem value="Corn">Corn</SelectItem>
                        <SelectItem value="Soybeans">Soybeans</SelectItem>
                        <SelectItem value="Grapes">Grapes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Farming Methods</CardTitle>
                <CardDescription>
                  Techniques and methods you use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentData.farmingMethods.map((method, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {method}
                      {isEditing && (
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeFarmingMethod(method)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Select onValueChange={addFarmingMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add method..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Organic">Organic</SelectItem>
                        <SelectItem value="Drip Irrigation">
                          Drip Irrigation
                        </SelectItem>
                        <SelectItem value="Crop Rotation">
                          Crop Rotation
                        </SelectItem>
                        <SelectItem value="Precision Farming">
                          Precision Farming
                        </SelectItem>
                        <SelectItem value="Greenhouse">Greenhouse</SelectItem>
                        <SelectItem value="Hydroponics">Hydroponics</SelectItem>
                        <SelectItem value="Integrated Pest Management">
                          IPM
                        </SelectItem>
                        <SelectItem value="No-Till Farming">
                          No-Till Farming
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
