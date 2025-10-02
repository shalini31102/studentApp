import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { API_ENDPOINTS } from "../config/api";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  
  const router = useRouter();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedClass, selectedSection, selectedGender, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.students);
      setStudents(response.data);
    } catch (error) {
      console.log("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = students;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.studentName?.toLowerCase().includes(query) ||
          student.studentId?.toLowerCase().includes(query) ||
          student.rollNo?.toLowerCase().includes(query)
      );
    }

    // Class filter
    if (selectedClass !== "All") {
      filtered = filtered.filter((student) => student.class === selectedClass);
    }

    // Section filter
    if (selectedSection !== "All") {
      filtered = filtered.filter((student) => student.section === selectedSection);
    }

    // Gender filter
    if (selectedGender !== "All") {
      filtered = filtered.filter((student) => student.gender === selectedGender);
    }

    setFilteredStudents(filtered);
  };

  const clearFilters = () => {
    setSelectedClass("All");
    setSelectedSection("All");
    setSelectedGender("All");
    setSearchQuery("");
  };

  const getUniqueValues = (key) => {
    const values = students.map((s) => s[key]).filter(Boolean);
    return ["All", ...new Set(values)];
  };

  const StudentCard = ({ student }) => (
    <Pressable style={styles.studentCard}>
      <View style={styles.studentAvatar}>
        <Text style={styles.avatarText}>
          {student.studentName?.substring(0, 2).toUpperCase() || "??"}
        </Text>
      </View>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{student.studentName}</Text>
        <Text style={styles.studentDetail}>Roll No: {student.rollNo}</Text>
        <Text style={styles.studentDetail}>ID: {student.studentId}</Text>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Class {student.class}-{student.section}</Text>
          </View>
          <View style={[styles.tag, styles.tagSecondary]}>
            <Text style={styles.tagTextSecondary}>{student.gender}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </Pressable>
  );

  const FilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Students</Text>
            <Pressable onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={28} color="#333" />
            </Pressable>
          </View>

          {/* Class Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Class</Text>
            <View style={styles.filterOptions}>
              {getUniqueValues("class").map((classValue) => (
                <Pressable
                  key={classValue}
                  style={[
                    styles.filterChip,
                    selectedClass === classValue && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedClass(classValue)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedClass === classValue && styles.filterChipTextActive,
                    ]}
                  >
                    {classValue}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Section Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Section</Text>
            <View style={styles.filterOptions}>
              {getUniqueValues("section").map((section) => (
                <Pressable
                  key={section}
                  style={[
                    styles.filterChip,
                    selectedSection === section && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedSection(section)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedSection === section && styles.filterChipTextActive,
                    ]}
                  >
                    {section}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Gender Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Gender</Text>
            <View style={styles.filterOptions}>
              {["All", "Male", "Female", "Other"].map((gender) => (
                <Pressable
                  key={gender}
                  style={[
                    styles.filterChip,
                    selectedGender === gender && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedGender(gender)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedGender === gender && styles.filterChipTextActive,
                    ]}
                  >
                    {gender}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.modalActions}>
            <Pressable
              style={[styles.modalButton, styles.clearButton]}
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, styles.applyButton]}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </Pressable>
        <Text style={styles.headerTitle}>Students</Text>
        <Pressable onPress={() => router.push("/(home)/adddetails")}>
          <Ionicons name="add-circle" size={32} color="#667eea" />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholder="Search by name, ID, or roll number..."
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </Pressable>
          )}
        </View>
        <Pressable
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter" size={24} color="#667eea" />
        </Pressable>
      </View>

      {/* Active Filters */}
      {(selectedClass !== "All" || selectedSection !== "All" || selectedGender !== "All") && (
        <View style={styles.activeFilters}>
          <Text style={styles.activeFiltersLabel}>Active Filters:</Text>
          {selectedClass !== "All" && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>Class {selectedClass}</Text>
              <Pressable onPress={() => setSelectedClass("All")}>
                <Ionicons name="close" size={16} color="#667eea" />
              </Pressable>
            </View>
          )}
          {selectedSection !== "All" && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>Section {selectedSection}</Text>
              <Pressable onPress={() => setSelectedSection("All")}>
                <Ionicons name="close" size={16} color="#667eea" />
              </Pressable>
            </View>
          )}
          {selectedGender !== "All" && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>{selectedGender}</Text>
              <Pressable onPress={() => setSelectedGender("All")}>
                <Ionicons name="close" size={16} color="#667eea" />
              </Pressable>
            </View>
          )}
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>
          Showing {filteredStudents.length} of {students.length} students
        </Text>
      </View>

      {/* Student List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading students...</Text>
        </View>
      ) : filteredStudents.length > 0 ? (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item._id || item.studentId}
          renderItem={({ item }) => <StudentCard student={item} />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No Students Found</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery || selectedClass !== "All" || selectedSection !== "All"
              ? "Try adjusting your filters"
              : "Add your first student to get started"}
          </Text>
        </View>
      )}

      <FilterModal />
    </SafeAreaView>
  );
};

export default Students;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  searchSection: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "white",
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#e8eaf6",
    alignItems: "center",
    justifyContent: "center",
  },
  activeFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    gap: 8,
  },
  activeFiltersLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8eaf6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#667eea",
  },
  resultsBar: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#f8f9fa",
  },
  resultsText: {
    fontSize: 13,
    color: "#666",
  },
  listContent: {
    padding: 15,
  },
  studentCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  studentAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#667eea",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  studentDetail: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  tags: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: "#e8eaf6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#667eea",
  },
  tagSecondary: {
    backgroundColor: "#f0f0f0",
  },
  tagTextSecondary: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  filterSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filterChipActive: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  filterChipTextActive: {
    color: "white",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#f5f5f5",
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  applyButton: {
    backgroundColor: "#667eea",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});