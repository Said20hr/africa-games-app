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
            headers[index] !== "Status" ? (
              <Text
                style={[
                  styles.cell,
                  {
                    textAlign: index === 0 ? "left" : "left",
                    fontSize: fontPixel(rowTextSize ?? 14),
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
                  type="b2"
                  style={{ fontSize: fontPixel(rowTextSize ?? 14) }}
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
          textAlign: item === "Status" ? "center" : index > 0 ? "left" : "left",
          fontSize: fontPixel(rowTextSize ?? 14),
          width: item === "Status" ? 85 : "auto",
          marginLeft: item === "Status" ? 20 : 0,
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
    []
  );

  return (
    <>
      {!props.isFlatList ? (
        <>
          <View style={{ flexDirection: "row" }}>
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
  },
  cell: {
    fontWeight: "700",
    flex: 1,
  },
});
