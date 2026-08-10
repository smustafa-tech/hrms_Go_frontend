import React, { useEffect, useState } from "react";
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
import { Save } from "lucide-react";
import { toast } from "@/hooks/use-Toast";
import styles from "../../pages/Settings/Settings.module.css";
import { useSettingsStore } from "../../store/settingsStore";
import api from "@/Services/api";

const CompanySettings = () => {
  const { companyData } = useSettingsStore();
  const setCompanyData = useSettingsStore.setState;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ================= FETCH COMPANY ================= */
  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("🔄 Fetching company data...");
        const res = await api.get("/company/me");
        console.log("✅ Company data:", res.data);

        setCompanyData({ companyData: res.data });
      } catch (err) {
        console.error("❌ Fetch company error:", err);
        console.error("🔍 Error details:", {
          status: err.response?.status,
          message: err.response?.data?.message,
          data: err.response?.data
        });
        
        // Set default company data if API fails
        const savedCompany = localStorage.getItem('companyData');
        const defaultCompany = savedCompany ? JSON.parse(savedCompany) : {
          name: "",
          email: "",
          phone: "",
          address: ""
        };
        
        setCompanyData({ companyData: defaultCompany });
        
        // Show specific error message
        const errorMsg = err.response?.data?.message || "Failed to load company info";
        setError(errorMsg);

        toast({
          title: "Warning",
          description: errorMsg,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  /* ================= UPDATE COMPANY ================= */
  const handleSave = async () => {
    setLoading(true);
    try {
      console.log("🔄 Updating company:", companyData);

      const res = await api.put("/company/update", companyData);
      console.log("✅ Update response:", res.data);

      toast({
        title: "Success",
        description: "Company information updated successfully",
        variant: "success",
      });
    } catch (err) {
      console.error("❌ Update company error:", err);
      
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update company info",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading company data...</div>;
  if (error && !companyData) return (
    <div style={{ padding: 20, color: "orange" }}>
      <p>{error}</p>
      <p>You can still edit company information below.</p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Details</CardTitle>
        <CardDescription>Manage your organization information</CardDescription>
      </CardHeader>

      <CardContent className={styles.cardContent}>
        <div className={styles.grid2}>
          {["name", "email", "phone"].map((field) => (
            <div key={field} className={styles.inputGroup}>
              <Label>{field.replace(/([A-Z])/g, " $1")}</Label>
              <Input
                value={companyData?.[field] || ""}
                onChange={(e) =>
                  setCompanyData({
                    companyData: {
                      ...companyData,
                      [field]: e.target.value,
                    },
                  })
                }
              />
            </div>
          ))}
        </div>

        <div className={styles.inputGroup}>
          <Label>Address</Label>
          <Textarea
            value={companyData?.address || ""}
            onChange={(e) =>
              setCompanyData({
                companyData: {
                  ...companyData,
                  address: e.target.value,
                },
              })
            }
          />
        </div>

        <div className={styles.buttonRight}>
          <Button onClick={handleSave} disabled={loading}>
            <Save /> {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanySettings;
