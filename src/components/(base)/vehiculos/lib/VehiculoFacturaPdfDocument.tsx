import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { VehiculoFacturaPdfData } from "./vehiculo-invoice-data";

const styles = StyleSheet.create({
  page: { padding: 50, fontSize: 9, fontFamily: "Helvetica", color: "#000" },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: { width: 100 },
  companyInfo: { textAlign: "left", marginTop: 10, marginLeft: 10 },
  topRightTable: { width: 180, marginBottom: 10 },
  invLabel: {
    color: "#e11d48",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 2,
  },
  dateBox: { flexDirection: "row", border: "1pt solid #000" },
  dateLabel: {
    width: "40%",
    padding: 3,
    borderRight: "1pt solid #000",
    textAlign: "center",
  },
  dateValue: {
    width: "60%",
    padding: 3,
    color: "#e11d48",
    textAlign: "center",
  },
  clientTable: { border: "1pt solid #000", marginBottom: 20 },
  tableRow: { flexDirection: "row", borderBottom: "1pt solid #000" },
  tableLabel: {
    width: 80,
    padding: 5,
    borderRight: "1pt solid #000",
    fontWeight: "bold",
  },
  tableValue: { flex: 1, padding: 5, color: "#e11d48" },
  mainTable: { border: "1pt solid #000", marginBottom: 20 },
  mainHeader: { flexDirection: "row", borderBottom: "1pt solid #000" },
  mainRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #000",
    minHeight: 25,
  },
  colDesc: { width: "60%", borderRight: "1pt solid #000", padding: 5 },
  colUnit: { width: "20%", borderRight: "1pt solid #000", padding: 5 },
  colAmt: { width: "20%", padding: 5, textAlign: "right" },
  redText: { color: "#e11d48" },
  bottomGrid: { flexDirection: "row", justifyContent: "space-between" },
  warrantyBox: {
    width: "60%",
    border: "1pt solid #000",
    padding: 10,
    height: 100,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  topWarrantyText: { textAlign: "left" },
  incotermText: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  totalsTable: { width: "35%" },
  totalRow: { flexDirection: "row", marginBottom: -1 },
  totalBoxValue: {
    width: "50%",
    border: "1pt solid #000",
    padding: 5,
    textAlign: "right",
    color: "#e11d48",
  },
  totalBoxLabel: { width: "50%", padding: 5 },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 80,
  },
  sigWrapper: { width: "40%", alignItems: "center" },
  sigLine: {
    width: "100%",
    borderTop: "1pt solid #000",
    textAlign: "center",
    paddingTop: 5,
    fontSize: 8,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
  },
});

export function VehiculoFacturaPdfDocument({
  data,
}: {
  data: VehiculoFacturaPdfData;
}) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.headerSection}>
          <View>
            {data.logoSrc ? (
              <Image src={data.logoSrc} style={styles.logo} />
            ) : null}
            <View style={styles.companyInfo}>
              <Text>3651 DANBURY ROAD</Text>
              <Text>BREWSTER, NY 10509</Text>
            </View>
          </View>
          <View style={styles.topRightTable}>
            <Text style={styles.invLabel}>
              INVOICE No. {data.invoiceNumber}
            </Text>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>DATE</Text>
              <Text style={styles.dateValue}>{data.invoiceDateDisplay}</Text>
            </View>
          </View>
        </View>

        <View style={styles.clientTable}>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>BILL TO</Text>
            <Text style={styles.tableValue}>
              {data.customerName} . NIT {data.customerNit}
            </Text>
          </View>
          <View style={[styles.tableRow, { borderBottom: 0 }]}>
            <Text style={styles.tableLabel}>ADDRESS</Text>
            <Text style={styles.tableValue}>{data.customerAddress}</Text>
          </View>
        </View>

        <View style={styles.mainTable}>
          <View style={styles.mainHeader}>
            <Text style={[styles.colDesc, { textAlign: "center" }]}>
              DESCRIPTION
            </Text>
            <Text style={[styles.colUnit, { textAlign: "center" }]}>
              UNIT PRICE
            </Text>
            <Text style={[styles.colAmt, { textAlign: "center" }]}>AMOUNT</Text>
          </View>
          <View style={styles.mainRow}>
            <Text style={[styles.colDesc, styles.redText]}>
              {data.carDescription}
            </Text>
            <Text style={styles.colUnit} />
            <Text style={[styles.colAmt, styles.redText]}>{data.unitPrice}</Text>
          </View>
          <View style={styles.mainRow}>
            <Text style={styles.colDesc} />
            <Text style={styles.colUnit} />
            <Text style={styles.colAmt} />
          </View>
        </View>

        <View style={styles.bottomGrid}>
          <View style={styles.warrantyBox}>
            <Text style={styles.topWarrantyText}>{data.terms}</Text>
            <Text style={styles.incotermText}>
              INCOTERMS {data.incoterms}
            </Text>
          </View>
          <View style={styles.totalsTable}>
            <View style={styles.totalRow}>
              <View style={styles.totalBoxValue}>
                <Text>{data.subTotal}</Text>
              </View>
              <View style={styles.totalBoxLabel}>
                <Text>SUB TOTAL</Text>
              </View>
            </View>
            <View style={styles.totalRow}>
              <View style={styles.totalBoxValue}>
                <Text>{data.total}</Text>
              </View>
              <View style={styles.totalBoxLabel}>
                <Text>TOTAL</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.sigWrapper}>
            <Text style={styles.sigLine}>BUYER SIGNATURE</Text>
          </View>
          <View style={styles.sigWrapper}>
            <Text style={styles.sigLine}>SELLER SIGNATURE</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          3651 Danbury Road Brewster, NY 10509, Used Automobile Dealer tel. +1
          (845) 309-7936.
        </Text>
      </Page>
    </Document>
  );
}
