"use client"
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Controller } from "react-hook-form";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { updateUserProfile } from "@/lib/actions/auth.action";

const profileSchema = z.object({
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  link1: z.string().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "Must be a valid URL",
  }).optional(),
  link2: z.string().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "Must be a valid URL",
  }).optional(),
  link3: z.string().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "Must be a valid URL",
  }).optional(),
  link4: z.string().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "Must be a valid URL",
  }).optional(),
});

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdate: () => void;
}

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }: EditProfileModalProps) => {
  const [profileImage, setProfileImage] = useState<string | null>(user?.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: user?.bio || "",
      link1: user?.link1 || "",
      link2: user?.link2 || "",
      link3: user?.link3 || "",
      link4: user?.link4 || "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      // For now, we'll just update the text fields
      // Image upload would need to be handled separately (e.g., upload to Firebase Storage first)
      const result = await updateUserProfile({
        userId: user.id,
        bio: data.bio,
        link1: data.link1,
        link2: data.link2,
        link3: data.link3,
        link4: data.link4,
        image: profileImage, // This would be the uploaded URL in production
      });

      if (result.success) {
        toast.success("Profile updated successfully!");
        // Refresh the page to update header and other components
        window.location.reload();
        onUpdate();
        onClose();
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="card-border !w-full">
            <div className="card p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-dark-200 transition-colors"
                  aria-label="Close"
                >
                  <X size={20} className="text-light-100" />
                </button>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="relative size-32 rounded-full overflow-hidden border-4 border-dark-200 bg-dark-300">
                        {profileImage ? (
                          <Image
                            src={profileImage}
                            alt="Profile"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full bg-primary-200 text-dark-100 text-5xl font-bold">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleImageClick}
                        className="absolute bottom-0 right-0 p-2 bg-primary-200 text-dark-100 rounded-full hover:bg-primary-200/80 transition-colors shadow-lg"
                      >
                        <Camera size={16} />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-light-100/60 text-center">
                      Click the camera icon to change your profile picture
                    </p>
                  </div>

                  {/* Bio */}
                  <Controller
                    name="bio"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="label">Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            className="input min-h-[100px] resize-none"
                            placeholder="Tell us about yourself..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-light-100/60 mt-1">
                          {field.value?.length || 0}/500 characters
                        </p>
                      </FormItem>
                    )}
                  />

                  {/* Links */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-light-100">Links</h3>
                    
                    <Controller
                      name="link1"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="label">Link 1</FormLabel>
                          <FormControl>
                            <Input
                              className="input"
                              placeholder="https://example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Controller
                      name="link2"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="label">Link 2</FormLabel>
                          <FormControl>
                            <Input
                              className="input"
                              placeholder="https://example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Controller
                      name="link3"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="label">Link 3</FormLabel>
                          <FormControl>
                            <Input
                              className="input"
                              placeholder="https://example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Controller
                      name="link4"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="label">Link 4</FormLabel>
                          <FormControl>
                            <Input
                              className="input"
                              placeholder="https://example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      onClick={onClose}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="btn-primary flex-1"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditProfileModal;

