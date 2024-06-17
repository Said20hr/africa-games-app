import React from "react";
import {
  FlatList,
  FlatListProps,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Text from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

interface TableProps
  extends Omit<FlatListProps<unknown>, "data" | "renderItem"> {
  reports: unknown[];
  headers: string[];
  rowTextSize?: number;
}

const Table = (props: TableProps) => {
  const { primary, success, danger } = useThemeColor();
  const renderItem = ({ item }: { item: unknown }) => (
    <View style={styles.row}>
      {typeof item === "object" &&
        item &&
        Object.values(item).map((item, index) =>
          props.headers[index] !== "Status" ? (
            <Text
              style={[
                styles.cell,
                {
                  textAlign: index === 0 ? "left" : "right",
                  fontSize: props.rowTextSize ?? 12,
                },
              ]}
            >
              {item ?? ""}
            </Text>
          ) : (
            <TouchableOpacity
              style={[
                {
                  alignSelf: "flex-start",
                  backgroundColor:
                    item === "Pending"
                      ? primary
                      : item === "Refused"
                      ? danger
                      : success,
                  paddingHorizontal: 4,
                  paddingVertical: 4,
                  alignItems: "center",
                  borderRadius: 16,
                  width: 78,
                  marginLeft: 20,
                },
              ]}
            >
              <Text type="b2" style={{ fontSize: props.rowTextSize ?? 12 }}>
                {item}
              </Text>
            </TouchableOpacity>
          )
        )}
    </View>
  );

  return (
    <FlatList
      data={props.reports}
      renderItem={renderItem}
      ListHeaderComponent={() => (
        <View style={styles.tableHeader}>
          {props.headers.map((item, index) => (
            <Text
              style={[
                styles.tableHeaderText,
                {
                  textAlign:
                    item === "Status" ? "center" : index > 0 ? "right" : "left",
                  fontSize: props.rowTextSize ?? 12,
                  width: item === "Status" ? 85 : "auto",
                  marginLeft: item === "Status" ? 20 : 0,
                },
              ]}
            >
              {item}
            </Text>
          ))}
        </View>
      )}
    />
  );
};
export default Table;

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 12,
  },
  tableHeaderText: {
    color: Colors.dark.tabIconDefault,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    flex: 1,
  },
  cell: {
    fontSize: 12,
    fontWeight: "700",
    flex: 1,
  },
});
