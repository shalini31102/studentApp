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
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_ENDPOINTS } from "../config/api";

const SearchResults = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [showFilters, setShowFilters] = useState(true);

  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    fetchStudents();
    if (params.query) {
      setSearchQuery(params.query);
    }
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
          student.rollNo?.toLowerCase().includes(query) ||
          student.class?.toLowerCase().includes(query)
      );
    }

    // Class filter
    if (selectedClass !== "All") {
      filtered = filtered.filter((student) => student.class === selectedClass);
    }

    // Section filter
    if (selectedSection !== "All") {
      filtered = filtered.filter(
        (student) => student.section === selectedSection
      );
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
            <Text style={styles.tagText}>
              Class {student.class}-{student.section}
            </Text>
          </View>
          <View style={[styles.tag, styles.tagSecondary]}>
            <Text style={styles.tagTextSecondary}>{student.gender}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </Pressable>
  );

  const FilterChip = ({ label, selected, onPress }) => (
    <Pressable
      style={[styles.filterChip, selected && styles.filterChipActive]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterChipText,
          selected && styles.filterChipTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </Pressable>
        <Text style={styles.headerTitle}>Advanced Search</Text>
        <Pressable onPress={clearFilters}>
          <Text style={styles.clearText}>Clear</Text>
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
            placeholder="Search by name, ID, roll number, class..."
            placeholderTextColor="#999"
            autoFocus={!params.query}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </Pressable>
          )}
        </View>
        <Pressable
          style={styles.filterToggleButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons
            name={showFilters ? "chevron-up" : "chevron-down"}
            size={24}
            color="#667eea"
          />
        </Pressable>
      </View>

      {/* Filters Section */}
      {showFilters && (
        <ScrollView
          horizontal={false}
          style={styles.filtersContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Class Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Class</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScrollView}
            >
              {getUniqueValues("class").map((classValue) => (
                <FilterChip
                  key={classValue}
                  label={classValue}
                  selected={selectedClass === classValue}
                  onPress={() => setSelectedClass(classValue)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Section Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Section</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScrollView}
            >
              {getUniqueValues("section").map((section) => (
                <FilterChip
                  key={section}
                  label={section}
                  selected={selectedSection === section}
                  onPress={() => setSelectedSection(section)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Gender Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Gender</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScrollView}
            >
              {["All", "Male", "Female", "Other"].map((gender) => (
                <FilterChip
                  key={gender}
                  label={gender}
                  selected={selectedGender === gender}
                  onPress={() => setSelectedGender(gender)}
                />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      )}

      {/* Results Count */}
      <View style={styles.resultsBar}>
        <Ionicons name="people" size={20} color="#667eea" />
        <Text style={styles.resultsText}>
          {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'} found
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
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your search or filters
          </Text>
          <Pressable style={styles.resetButton} onPress={clearFilters}>
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchResults;

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
  clearText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#667eea",
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
  filterToggleButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#e8eaf6",
    alignItems: "center",
    justifyContent: "center",
  },
  filtersContainer: {
    backgroundColor: "white",
    maxHeight: 250,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  filterSection: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  filterScrollView: {
    flexDirection: "row",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginRight: 8,
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
  resultsBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    gap: 8,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#667eea",
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
  resetButton: {
    marginTop: 20,
    backgroundColor: "#667eea",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});