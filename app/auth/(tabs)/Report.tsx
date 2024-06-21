import Header from "@/components/Header";
import Text from "@/components/ThemedText";
import { Container } from "@/components/ui";
import React, { useState } from "react";
import { ReportConfirmModal, ReportForm } from "./AddTab";

export default function Report() {
  const [showModal, toggleModal] = useState(false);
  return (
    <Container style={{ paddingHorizontal: 0, paddingTop: 0 }}>
      <Header title="Daily Report" image />
      <ReportForm
        handleSubmit={() => {
          toggleModal(true);
        }}
      />
      <ReportConfirmModal
        visible={showModal}
        continuePress={() => {
          toggleModal(false);
        }}
      />
    </Container>
  );
}
