import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// 1. Makes sure the dish will always save with the correct data types and properties
interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: string; // Dynamic values mapping to Starter, Main Course, or Dessert
  price: string;
}

// 2. Tracks if there are any missing items or errors
interface FormErrors {
  dishName?: string;
  description?: string;
  course?: string;
  price?: string;
}

const COURSES = ['Starter', 'Main Course', 'Dessert'];

export default function App() {
  // Form Input States
  const [dishName, setDishName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  // Array menuitems will store the dishes added
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: '1', name: 'Garlic Bread', description: 'Toasted baguette with garlic butter', course: 'Starter', price: '45.00' },
    { id: '2', name: 'Rump Steak', description: '300g flame-grilled steak with chips', course: 'Main Course', price: '185.00' },
    { id: '3', name: 'Malva Pudding', description: 'Traditional warm pudding with custard', course: 'Dessert', price: '60.00' },
  ]);

  // Editing State Handlers
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search & Filter State Handlers
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCourse, setFilterCourse] = useState<string>('');

  // UX Feedback & Message Handlers
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Save handling logic (Handles both adding new items and updating existing items)
  const handleSaveMenuItem = () => {
    let currentErrors: FormErrors = {};

    if (!dishName.trim()) currentErrors.dishName = 'Dish Name is required.';
    if (!description.trim()) currentErrors.description = 'Description is required.';
    if (!course.trim()) currentErrors.course = 'Course category selection is required.';
    
    if (!price.trim()) {
      currentErrors.price = 'Price is required.';
    } else if (isNaN(Number(price)) || parseFloat(price) <= 0) {
      currentErrors.price = 'Please enter a valid positive price amount.';
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      setSuccessMessage('');
      return;
    }

    if (editingId) {
      // Update entry
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: dishName.trim(),
                description: description.trim(),
                course: course.trim(),
                price: parseFloat(price).toFixed(2),
              }
            : item
        )
      );
      setSuccessMessage(`"${dishName.trim()}" successfully updated!`);
    } else {
      // Add entry
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: dishName.trim(),
        description: description.trim(),
        course: course.trim(),
        price: parseFloat(price).toFixed(2),
      };
      setMenuItems((prevItems) => [...prevItems, newItem]);
      setSuccessMessage(`"${newItem.name}" successfully added to the menu!`);
    }

    resetForm();

    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  // Select item for modification updates
  const handleEditSelect = (item: MenuItem) => {
    setEditingId(item.id);
    setDishName(item.name);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(item.price);
    setErrors({});
  };

  // Remove menu item out of data directory arrays
  const handleDeleteItem = (id: string) => {
    Alert.alert(
      'Remove Menu Item',
      'Are you sure you want to completely delete this item from the directory list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
            if (editingId === id) resetForm();
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setEditingId(null);
    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setErrors({});
  };

  // Requirement 2: Process Search Criteria Filtering Logics
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterCourse ? item.course === filterCourse : true;
      return matchesSearch && matchesFilter;
    });
  }, [menuItems, searchQuery, filterCourse]);

  // Requirement 3: Dynamic Menu Statistics Computations
  const stats = useMemo(() => {
    const total = menuItems.length;
    const totalSum = menuItems.reduce((acc, item) => acc + parseFloat(item.price), 0);
    const avg = total > 0 ? totalSum / total : 0;

    const courseCounts = menuItems.reduce((acc: Record<string, number>, item) => {
      acc[item.course] = (acc[item.course] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      avgPrice: avg.toFixed(2),
      starters: courseCounts['Starter'] || 0,
      mains: courseCounts['Main Course'] || 0,
      desserts: courseCounts['Dessert'] || 0,
    };
  }, [menuItems]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          
          {/* Brand Header Display Area */}
          <View style={styles.header}>
            <View style={styles.imageLockWrapper}>
              <Image 
                source={require('./assets/restaurant.png')} 
                style={styles.logoImage} 
                resizeMode="contain"
              />
            </View>
            <Text style={styles.headerTitle}>CHRISTOFFEL'S MENU MANAGER</Text>
            <Text style={styles.headerSubtitle}>Restaurant Setup</Text>
          </View>

          {/* --- STATISTICS CARD SECTION --- */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Menu Overview & Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total Dishes</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>R {stats.avgPrice}</Text>
                <Text style={styles.statLabel}>Average Price</Text>
              </View>
            </View>
            <View style={styles.courseStatsRow}>
              <Text style={styles.courseStatText}>Starters: <Text style={styles.highlightText}>{stats.starters}</Text></Text>
              <Text style={styles.courseStatText}>Mains: <Text style={styles.highlightText}>{stats.mains}</Text></Text>
              <Text style={styles.courseStatText}>Desserts: <Text style={styles.highlightText}>{stats.desserts}</Text></Text>
            </View>
          </View>
          
          {/* Form container for details capture */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>
              {editingId ? 'Modify Selected Item Details' : 'Capture New Dish Details'}
            </Text>

            {successMessage ? (
              <View style={styles.successAlert}>
                <Text style={styles.successAlertText}>{successMessage}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dish Name</Text>
              <TextInput
                style={[styles.input, errors.dishName && styles.inputErrorBorder]}
                placeholder="e.g., Prego Roll"
                placeholderTextColor="#94A3B8"
                value={dishName}
                onChangeText={setDishName}
              />
              {errors.dishName && <Text style={styles.errorText}>{errors.dishName}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea, errors.description && styles.inputErrorBorder]}
                placeholder="Describe ingredients, flavor profiles, or allergens..."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={3}
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Course Category</Text>
              <View style={styles.pickerButtonGroup}>
                {COURSES.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.pickerButton,
                      course === item && styles.pickerButtonActive,
                      errors.course && !course && styles.inputErrorBorder
                    ]}
                    onPress={() => setCourse(item)}
                  >
                    <Text style={[styles.pickerButtonText, course === item && styles.pickerButtonTextActive]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.course && <Text style={styles.errorText}>{errors.course}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price (R)</Text>
              <TextInput
                style={[styles.input, errors.price && styles.inputErrorBorder]}
                placeholder="e.g., 89.00"
                placeholderTextColor="#94A3B8"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
              />
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleSaveMenuItem}>
                <Text style={styles.primaryButtonText}>{editingId ? 'Update Menu Item' : 'Save Menu Item'}</Text>
              </TouchableOpacity>

              {editingId ? (
                <TouchableOpacity style={styles.secondaryButton} onPress={resetForm}>
                  <Text style={styles.secondaryButtonText}>Cancel Edit</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Current Menu</Text>

            <View style={styles.searchBox}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search dishes..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.filterChip, !filterCourse && styles.filterChipActive]}
                onPress={() => setFilterCourse('')}
              >
                <Text style={[styles.filterChipText, !filterCourse && styles.filterChipTextActive]}>All</Text>
              </TouchableOpacity>

              {COURSES.map((item) => (
                <TouchableOpacity
                  key={`filter-${item}`}
                  style={[styles.filterChip, filterCourse === item && styles.filterChipActive]}
                  onPress={() => setFilterCourse(item)}
                >
                  <Text style={[styles.filterChipText, filterCourse === item && styles.filterChipTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {filteredMenuItems.length === 0 ? (
              <Text style={styles.emptyState}>No dishes match the current search or filter.</Text>
            ) : (
              filteredMenuItems.map((item) => (
                <View key={item.id} style={styles.menuCard}>
                  <View style={styles.menuCardHeader}>
                    <View>
                      <Text style={styles.menuName}>{item.name}</Text>
                      <Text style={styles.menuCourse}>{item.course}</Text>
                    </View>
                    <Text style={styles.menuPrice}>R {item.price}</Text>
                  </View>

                  <Text style={styles.menuDescription}>{item.description}</Text>

                  <View style={styles.menuActions}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEditSelect(item)}>
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteItem(item.id)}>
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  imageLockWrapper: {
    width: 250,
    height: 250,
    borderRadius: 25,
    backgroundColor: '#0B1220',
    borderWidth: 2,
    borderColor: '#FBBF24',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  logoImage: {
    width: 265,
    height: 265,
    tintColor: '#F8FAFC',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    color: '#9CA3AF',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  formContainer: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statValue: {
    color: '#FBBF24',
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    color: '#D1D5DB',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
    textAlign: 'center',
  },
  courseStatsRow: {
    gap: 8,
  },
  courseStatText: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '600',
  },
  highlightText: {
    color: '#FBBF24',
    fontWeight: '800',
  },
  successAlert: {
    backgroundColor: '#14532D',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  successAlertText: {
    color: '#DCFCE7',
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    color: '#E5E7EB',
    fontWeight: '700',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#374151',
    fontSize: 15,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  inputErrorBorder: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  pickerButtonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#1F2937',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#374151',
  },
  pickerButtonActive: {
    backgroundColor: '#FBBF24',
    borderColor: '#FBBF24',
  },
  pickerButtonText: {
    color: '#E5E7EB',
    fontWeight: '700',
    fontSize: 12,
  },
  pickerButtonTextActive: {
    color: '#111827',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#FBBF24',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#111827',
    fontWeight: '800',
    fontSize: 15,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  secondaryButtonText: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 15,
  },
  searchBox: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#374151',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: '#1F2937',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  filterChipActive: {
    backgroundColor: '#FBBF24',
    borderColor: '#FBBF24',
  },
  filterChipText: {
    color: '#E5E7EB',
    fontWeight: '700',
    fontSize: 12,
  },
  filterChipTextActive: {
    color: '#111827',
  },
  emptyState: {
    color: '#D1D5DB',
    textAlign: 'center',
    paddingVertical: 16,
  },
  menuCard: {
    backgroundColor: '#1F2937',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  menuCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  menuName: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  menuCourse: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  menuPrice: {
    color: '#FDE68A',
    fontSize: 18,
    fontWeight: '800',
  },
  menuDescription: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  menuActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#1D4ED8',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#EFF6FF',
    fontWeight: '700',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#7F1D1D',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FEE2E2',
    fontWeight: '700',
  },
});
