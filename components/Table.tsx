import React, { useCallback } from "react";
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
import { fontPixel, heightPixel } from "@/shared/util/normalise";
import { i18n } from "@/constants/i18n";

interface TableProps
  extends Omit<FlatListProps<unknown>, "data" | "renderItem"> {
  reports: unknown[];
  headers: string[];
  rowTextSize?: number;
  isFlatList?: boolean;
}

type TableRowProps = {
  item: unknown;
  rowTextSize?: number;
  headers: string[];
};

const TableRow = ({ item, rowTextSize, headers }: TableRowProps) => {
  const { primary, success, danger } = useThemeColor();
  return (
    <>
      <View style={styles.row}>
        {typeof item === "object" &&
          item &&
          Object.values(item).map((item, index) =>
            headers[index] !== i18n.t("movements.tableHeaders.status") ? (
              <Text
                style={[
                  styles.cell,
                  {
                    textAlign: index === 0 ? "left" : "left",
                    fontSize: fontPixel(rowTextSize || 14),
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
                <Text
                  type="BodySmall"
                  style={{ fontSize: fontPixel(rowTextSize || 14) }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )
          )}
      </View>
    </>
  );
};

const TableHeaderRow = ({
  item,
  rowTextSize,
  index,
}: {
  item: string;
  rowTextSize?: number;
  index: number;
}) => {
  return (
    <Text
      style={[
        styles.tableHeaderText,
        {
          textAlign:
            item === i18n.t("movements.tableHeaders.status")
              ? "center"
              : index > 0
              ? "left"
              : "left",
          fontSize: fontPixel(rowTextSize ?? 14),
          width: item === i18n.t("movements.tableHeaders.status") ? 85 : "auto",
          marginLeft: item === i18n.t("movements.tableHeaders.status") ? 20 : 0,
        },
      ]}
    >
      {item}
    </Text>
  );
};

const Table = (props: TableProps) => {
  const renderItem = useCallback(
    ({ item, index }: { item: unknown; index: number }) => (
      <TableRow
        headers={props.headers}
        item={item}
        rowTextSize={props.rowTextSize}
        key={index}
      />
    ),
    [props.reports]
  );

  return (
    <>
      {!props.isFlatList ? (
        <>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#444444",
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          >
            {props.headers.map((item, index) => (
              <TableHeaderRow
                item={item}
                index={index}
                rowTextSize={props.rowTextSize}
                key={item}
              />
            ))}
          </View>
          <View style={{ flexDirection: "column" }}>
            {props.reports.map((item, index) => (
              <TableRow
                headers={props.headers}
                item={item}
                rowTextSize={props.rowTextSize}
                key={index}
              />
            ))}
          </View>
          {/* </View> */}
        </>
      ) : (
        <FlatList
          data={props.reports}
          renderItem={renderItem}
          ListHeaderComponent={() => (
            <View style={styles.tableHeader}>
              {props.headers.map((item, index) => (
                <TableHeaderRow
                  item={item}
                  index={index}
                  rowTextSize={props.rowTextSize}
                  key={item}
                />
              ))}
            </View>
          )}
        />
      )}
    </>
  );
};
export default Table;

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  tableHeaderText: {
    color: Colors.dark.tabIconDefault,
    fontWeight: "bold",
    textAlign: "right",
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: heightPixel(20),
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#444444",
    paddingBottom: 10,
  },
  cell: {
    fontWeight: "700",
    flex: 1,
  },
});
