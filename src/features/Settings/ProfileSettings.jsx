import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Eye, EyeOff, Lock, Save, Camera } from "lucide-react";
import { toast } from "@/hooks/use-Toast";
import styles from "../../pages/Settings/Settings.module.css";
import { useSettingsStore } from "../../store/settingsStore";
import api from "@/Services/api";
const ProfileSettings = () => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const {
    profileData,
    updateProfile,
    fetchProfile,
    loadingProfile,
    loadingUpdate,
    updatePassword,
    setProfileField,
    profileError,
    uploadProfilePhoto,
  } = useSettingsStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  console.log("📊 Profile Data in Component:", profileData);
  console.log('📊 Profile Data Keys:', Object.keys(profileData || {}));
  console.log('📊 Profile Data Structure:', JSON.stringify(profileData, null, 2));
  const photo = profileData.Admin?.photo || profileData.Employee?.photo;

  const firstName =
    profileData.Admin?.firstName || profileData.Employee?.firstName;

  const lastName =
    profileData.Admin?.lastName || profileData.Employee?.lastName;

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    console.log('🔍 Profile data for photo upload:', profileData);
    
    // Try multiple possible ID fields
    const userId = profileData?.Admin?.id || 
                   profileData?.Employee?.id || 
                   profileData?.id ||
                   profileData?.userId;
    
    console.log('🆔 Found user ID:', userId);
    
    if (!userId) {
      console.error('❌ No user ID found in profile data');
      toast({ 
        title: "Error",
        description: "User ID not found", 
        variant: "destructive" 
      });
      return;
    }
    
    const response = await uploadProfilePhoto(userId, file);

    if (response.success) {
      toast({ 
        title: "Success",
        description: "Photo updated successfully", 
        variant: "success" 
      });
      fetchProfile();
    } else {
      toast({ 
        title: "Error",
        description: "Failed to upload photo", 
        variant: "destructive" 
      });
    }
  };

  const handleSave = async () => {
    const response = await updateProfile();
    if (response.success) {
      toast({ 
        title: "Success",
        description: "Profile updated successfully", 
        variant: "success" 
      });
    } else {
      toast({ 
        title: "Error",
        description: "Failed to update profile", 
        variant: "destructive" 
      });
    }
  };

  const bufferToBase64 = (buffer) => {
    if (!buffer) return null;

    const uint8Array = new Uint8Array(buffer);
    let binaryString = "";
    uint8Array.forEach((byte) => {
      binaryString += String.fromCharCode(byte);
    });

    return `data:image/jpeg;base64,${btoa(binaryString)}`;
  };

  const handlePasswordUpdate = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    console.log("Password Update Data:", passwordData);

    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
    }

    if (newPassword !== confirmPassword) {
      return toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
    }

    if (newPassword.length < 6) {
      return toast({
        title: "Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
    }

    try {
      const res = await api.put("/users/change-password", {
        oldPassword,
        newPassword,
      });

      toast({
        title: "Success",
        description: res.data.message || "Password updated successfully",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Error updating password",
        variant: "destructive",
      });
    }
  };

  if (loadingProfile) return <div style={{padding: '20px'}}>Loading profile...</div>;
  if (profileError) return <div style={{padding: '20px', color: 'red'}}>Error: {profileError}</div>;
  
  // Debug: Show what data we actually have
  console.log('🔍 Current profileData:', profileData);
  console.log('🔍 Has Admin?', !!profileData?.Admin);
  console.log('🔍 Has Employee?', !!profileData?.Employee);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal info and profile settings
          </CardDescription>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <div className={styles.avatarSection}>
            <Avatar className={styles.avatar}>
              {photo?.data ? (
                <AvatarImage src={bufferToBase64(photo.data)} alt="Profile" />
              ) : (
                <AvatarFallback>
                  {firstName?.[0]}
                  {lastName?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <div className={styles.avatarActions}>
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange} // REQUIRED
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("avatarInput").click()}
              >
                <Camera /> Change Photo
              </Button>

              <p className={styles.avatarNote}>
                type(.jpg, .jpeg or .png) & size(2MB max).
              </p>
            </div>
          </div>

          <Separator />

          <div className={styles.grid2}>
            {[
              "firstName",
              "middleName",
              "lastName",
              "email",
              "phone",
              "adharCard",
              "designation",
              "bio",
            ].map((field) => {
              const value = profileData?.Admin?.[field] ?? profileData?.Employee?.[field] ?? profileData?.[field] ?? "";
              return (
                <div key={field} className={styles.inputGroup}>
                  <Label>{field.replace(/([A-Z])/g, " $1").trim()}</Label>
                  <Input
                    name={field}
                    type={field === "email" ? "email" : "text"}
                    value={value}
                    onChange={(e) => setProfileField(field, e.target.value)}
                  />
                </div>
              );
            })}
          </div>

          <div className={styles.buttonRight}>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={loadingUpdate}
            >
              <Save /> {loadingUpdate ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>

        <CardContent className={styles.cardContent}>
          {/* Old Password */}
          <div className={styles.relativeInput}>
            <Input
              type={showPasswords.old ? "text" : "password"}
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  oldPassword: e.target.value,
                })
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={styles.eyeButton}
              onClick={() =>
                setShowPasswords({ ...showPasswords, old: !showPasswords.old })
              }
            >
              {showPasswords.old ? <EyeOff /> : <Eye />}
            </Button>
          </div>

          {/* New and Confirm Password */}
          <div className={styles.grid2}>
            <div className={styles.relativeInput}>
              <Input
                type={showPasswords.new ? "text" : "password"}
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={styles.eyeButton}
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    new: !showPasswords.new,
                  })
                }
              >
                {showPasswords.new ? <EyeOff /> : <Eye />}
              </Button>
            </div>

            <div className={styles.relativeInput}>
              <Input
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={styles.eyeButton}
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    confirm: !showPasswords.confirm,
                  })
                }
              >
                {showPasswords.confirm ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>

          <Button variant="primary" onClick={handlePasswordUpdate}>
            <Lock /> Update Password
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileSettings;
