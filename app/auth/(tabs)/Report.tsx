import Header from "@/components/Header";
import Text from "@/components/ThemedText";
import { Container } from "@/components/ui";
import React, { useEffect, useState } from "react";
import { ReportConfirmModal, ReportForm } from "./AddTab";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/app/ctx";
import axios from "axios";
import { InfoCard } from ".";
import { i18n } from "@/constants/i18n";
import { File } from "@/assets/icons";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { ChevronDown } from "react-native-feather";
import Table from "@/components/Table";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Report() {
  const [showModal, toggleModal] = useState(false);
  const { session } = useSession();
  const [reports, setReports] = useState([]);
  const { text } = useThemeColor();
  const { data, error } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      try {
        const token = session?.user.token;
        if (!token || token === "") return null;

        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/reports`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {}
    },
  });

  useEffect(() => {
    // const token = storage
    if (!data) return;
    let reports = [];
    data.map((item) => {
      reports.push({
        date: item.created_at.substring(0, 10),
        initialCash: `${item.cash_initial}  XAF`,
        finalCash: `${item.cash_final}  XAF`,
      });
    });
    setReports(reports);
  }, [data]);
  // const { t } = useTranslation();

  return (
    <Container style={{ paddingHorizontal: 0, paddingTop: 0 }}>
      <Header title="Daily Report" image />
      <ScrollView showsVerticalScrollIndicator={false}>
        <InfoCard
          title={i18n.t("home.reports")}
          icon={<File width={24} height={24} />}
          containerStyle={{ margin: 20 }}
          value=""
          action={
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 5,
                // paddingVertical: 3,
                borderRadius: 12,
                backgroundColor: "#444444",
              }}
            >
              <Text type="InputText">{i18n.t("home.thisMonth")}</Text>
              <ChevronDown color={text} style={{ marginLeft: 12 }} width={18} />
            </TouchableOpacity>
          }
        >
          <View>
            {reports.length > 0 ? (
              <Table
                reports={reports}
                headers={[
                  i18n.t("home.tableHeaders.date"),
                  i18n.t("home.tableHeaders.initialCash"),
                  i18n.t("home.tableHeaders.finalCash"),
                ]}
                isFlatList={false}
              />
            ) : (
              <Text>No reports to show</Text>
            )}
          </View>
        </InfoCard>
      </ScrollView>
    </Container>
  );
}
