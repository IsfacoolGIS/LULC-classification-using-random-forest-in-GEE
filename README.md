### 🌍 Land Cover Classification with Google Earth Engine (GEE) and Sentinel-2 🌍

This project utilizes **Google Earth Engine (GEE)** to perform **Land Use/Land Cover (LULC) classification** using **Sentinel-2** satellite imagery. The classification process incorporates a variety of spectral indices, such as NDVI, NDRE, GVI, and more, to enhance model performance. A **Random Forest classifier** is applied to classify the land cover types, leveraging indices for improved separability and accuracy.

#### **Features:**
🛰️ **Sentinel-2 Data**: Process satellite imagery from the **COPERNICUS/S2_HARMONIZED** collection for the specified region (e.g., Jodhpur, India) between November and December 2021.

🌱 **Spectral Indices Calculation**: Calculate key vegetation, urban, and water indices including:

- **NDVI** (Normalized Difference Vegetation Index)
- **NDRE** (Normalized Difference Red Edge Index)
- **GVI** (Green Vegetation Index)
- **SAVI** (Soil Adjusted Vegetation Index)
- **UVI** (Urban Vegetation Index)
- **MNDWI** (Modified Normalized Difference Water Index)
- **GNDVI** (Green Normalized Difference Vegetation Index)
- **RVI** (Ratio Vegetation Index) 
- **TVI** (Triangular Vegetation Index)
- **ENDISI** (Enhanced Normalized Difference Impervious Surface Index)
- **BSI** (Bare Soil Index)
- **OSAVI** (Optimized Soil Adjusted Vegetation Index)
- **LAI** (Leaf Area Index)
- **MBI** (Moisture Balance Index)
- **NDVIre** (Red Edge NDVI)

🎨 **Land Cover Classification**: Train and classify land cover types using a **Random Forest classifier**. The classifier uses spectral indices as input features, with classes including vegetation, bare land, built-up areas, and water bodies.

🗺️ **Map Visualizations**: Display the classified land cover on an interactive map with customized visualization parameters for each index.

🌏 **Export & Area Analysis**: Export the classified map as a **GeoTIFF** and calculate the area of each land cover class for analysis.

#### **How It Works:**
1. **Data Preprocessing**: 
   - Sentinel-2 imagery is filtered for the **Region of Interest (ROI)** and specific date ranges (November-December 2021).
   - A median composite image is created to reduce cloud cover and enhance data quality.

2. **Spectral Indices**:
   - Multiple spectral indices are calculated to capture vegetation, water, and urban features using the Sentinel-2 bands.
   - These indices help improve the separability between land cover classes and contribute to hyperparameter tuning.

3. **Supervised Classification**:
   - A **Random Forest classifier** is trained using ground truth data and spectral indices.
   - The classifier then assigns land cover classes based on the trained model.

4. **Hyperparameter Tuning**:
   - The performance of the Random Forest classifier is optimized using various spectral indices to enhance the classification results.

5. **Export & Results**:
   - The classified land cover map is exported as a **GeoTIFF**.
   - Area statistics for each land cover class are calculated and exported for further analysis.

#### **Visualization Example**:
- **NDVI**, **NDRE**, **MNDWI**, and other indices are visualized with custom color palettes, showcasing different land cover features such as vegetation, urban areas, and water bodies.

#### **Instructions**:
1. **Setup**:
   - Ensure you have a **Google Earth Engine (GEE)** account and access the **Sentinel-2** data collection.
   
2. **Define Region of Interest (ROI)**:
   - Specify your region of interest (e.g., Jodhpur, India) and the date range for analysis.

3. **Run the Script**:
   - Copy the provided script into the GEE code editor and run it. The classification and map visualizations will be generated.

4. **Export Results**:
   - Export the classified map and area statistics to your **Google Drive** as **GeoTIFF** files.

#### **Conclusion**:
This project demonstrates how to classify land use and land cover types using **Sentinel-2 imagery** and **Google Earth Engine**. By utilizing multiple spectral indices and the **Random Forest classifier**, the model achieves enhanced accuracy for land cover classification. This tool can be used for environmental monitoring, urban planning, and land management, providing valuable insights into land use changes over time.

