>>Load Sentinel-2A image collection
var s2 = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
                  .filterBounds(roi)
                  .filterDate('2021-11-01', '2021-12-31')
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 1))
                  .select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12']);

print(s2);
>>Median composite of Sentinel-2 image
var jodhpur21 = s2.median().clip(roi);
Map.addLayer(jodhpur21,imageVisParam,'Jodhpur2021');
Map.centerObject(roi, 10);

>>Calculate Normalized Difference Red Edge Index (NDRE)
var calculateNDRE = function(image) {
  var RedEdge1 = image.select('B5'); // Red Edge 1
  var NIR = image.select('B8'); // Near-Infrared
  
  var ndre = NIR.subtract(RedEdge1).divide(NIR.add(RedEdge1)).rename('NDRE');
  
  return ndre;
};

//>>Apply NDRE calculation to the image
var ndre = calculateNDRE(jodhpur21)

//>> Define GVI calculation function
var calculateGVI = function(image) {
  var NIR = image.select('B8'); // NIR
  var GREEN = image.select('B3'); // Green
  
  var gvi = NIR.divide(GREEN).rename('GVI');
  
  return gvi;
};

//>> Apply GVI calculation to the image
var gvi = calculateGVI(jodhpur21);

//>> Calculate Enhanced Normalized Difference Impervious Surface Index (ENDISI)
var calculateENDISI = function(image) {
  var NIR = image.select('B8'); // Near-Infrared
  var SWIR = image.select('B11'); // Short-Wave Infrared
  
  var ENDISI = NIR.subtract(SWIR).divide(NIR.add(SWIR));
  
  return ENDISI.rename('ENDISI');
};

//>> Apply ENDISI calculation to the image
var endisi = calculateENDISI(jodhpur21);

//>> Calculate Urban Composition Index (UCI)
var calculateUCI = function(image) {
  var NIR = image.select('B8'); // Near-Infrared
  var RED = image.select('B4'); // Red
  var SWIR = image.select('B11'); // Short-Wave Infrared
  
  var UCI = NIR.multiply(2).subtract(RED).subtract(SWIR)
            .divide(NIR.multiply(2).add(RED).add(SWIR));
  
  return UCI.rename('UCI');
};

//>> Apply UCI calculation to the image
var uci = calculateUCI(jodhpur21);

//>> Urban vegetation index
var uvi = jodhpur21.expression(
  '((B8 - B3) - (B11 - B8)) / ((B8 - B3) + (B11 - B8))', {
    'B3': jodhpur21.select('B3'), // Green
    'B8': jodhpur21.select('B8'), // NIR
    'B11': jodhpur21.select('B11')  // SWIR 1
}).rename('UVI');

//>> Urban Normalized Difference Water Index
var udwi = jodhpur21.normalizedDifference(['B3', 'B12']).rename('UDWI');


//>> Define NDVIre calculation function
var calculateNDVIre = function(image) {
  var RedEdge1 = image.select('B5'); // Red Edge 1
  var Red = image.select('B4'); // Red
  
  var ndvire = RedEdge1.subtract(Red).divide(RedEdge1.add(Red)).rename('NDVIre');
  
  return ndvire;
};

//>> Apply NDVIre calculation to the image
var ndvire = calculateNDVIre(jodhpur21);

//>> Define NDWI calculation function
var calculatendwi = function(image) {
  var B03 = image.select('B3'); // Green
  var B08 = image.select('B8'); // NIR
  
  var ndwi = B03.subtract(B08).divide(B03.add(B08)).rename('NDWI');
  
  return ndwi;
};

//>> Apply NDWI calculation to the image
var ndwi = calculatendwi(jodhpur21);

//>> Define LAI calculation function
var calculateLAI = function(image) {
  var B08 = image.select('B8'); // NIR
  
  var lai = B08.pow(2).multiply(0.00008).add(B08.multiply(0.0158)).subtract(0.5);
  
  return lai.rename('LAI');
};

//>> Apply LAI calculation to the image
var lai = calculateLAI(jodhpur21);


//>> Define OSAVI calculation function
var calculateOSAVI = function(image) {
  var B04 = image.select('B4'); // Red
  var B08 = image.select('B8'); // NIR
  
  var osavi = B08.subtract(B04).divide(B08.add(B04).add(0.16)).multiply(1.16);
  
  return osavi.rename('OSAVI');
};

//>> Apply OSAVI calculation to the image
var osavi = calculateOSAVI(jodhpur21);


//>> Define TVI calculation function
var calculateTVI = function(image) {
  var B02 = image.select('B2'); // Blue
  var B03 = image.select('B3'); // Green
  var B04 = image.select('B4'); // Red
  
  var tvi = B02.subtract(B03).divide(B02.add(B03).subtract(B04)).rename('TVI');
  
  return tvi;
};

//>> Apply TVI calculation to the image
var tvi = calculateTVI(jodhpur21);


//>> Define RVI calculation function
var calculateRVI = function(image) {
  var B04 = image.select('B4'); // Red
  var B08 = image.select('B8'); // NIR
  
  var rvi = B08.divide(B04).rename('RVI');
  
  return rvi;
};

//>> Apply RVI calculation to the image
var rvi = calculateRVI(jodhpur21);

//>> Define MBI calculation function
var calculateMBI = function(image) {
  var B02 = image.select('B2'); // Blue
  var B03 = image.select('B3'); // Green
  var B08 = image.select('B8'); // NIR
  
  var mbi = B08.subtract(B02).divide(B08.add(B02)).rename('MBI');
  
  return mbi;
};

//>> Apply MBI calculation to the image
var mbi = calculateMBI(jodhpur21);


//>> Define GNDVI calculation function
var calculateGNDVI = function(image) {
  var B03 = image.select('B3'); // Green
  var B08 = image.select('B8'); // NIR
  
  var gndvi = B08.subtract(B03)
                  .divide(B08.add(B03));
  
  return gndvi.rename('GNDVI');
};

//>> Apply GNDVI calculation to the image
var gndvi = calculateGNDVI(jodhpur21);

var B02 = jodhpur21.select('B2');
var B04 = jodhpur21.select('B4');
var B08 = jodhpur21.select('B8');
var B11 = jodhpur21.select('B11');

//>> for BSI which includes Red(4), SWIR(11), NIR(8), Blue(3)
var bsi = B11.add(B04).subtract(B08.add(B02)).divide(B11.add(B04).add(B08.add(B02))).rename(['BSI']);

//>> for SAVI which includes B8 and B4
var savi = function(image) {
  var B04 = image.select('B4'); // Red
  var B08 = image.select('B8'); // NIR
  
  var savi = B08.subtract(B04)
                  .divide(B08.add(B04).add(0.428))
                  .multiply(1.428);
  
  return savi.rename('SAVI');
};
var savi = jodhpur21.expression(
  '((B8 - B4) / (B8 + B4 + 0.428) * 1.428)', {
    'B4': jodhpur21.select('B4'), // Red
    'B8': jodhpur21.select('B8')  // NIR
}).rename('SAVI');



//>> for NDVI which is NIR(B8) and Red(B4)
var ndvi = jodhpur21.normalizedDifference(['B8', 'B4']).rename(['NDVI']);

//>> for mndwi which is Green(B3) and(B11)
var mndwi = jodhpur21.normalizedDifference(['B3', 'B11']).rename(['MNDWI']);


//>> Define visualization parameters for each index
var laiVis = {min: 170, max: 750, palette: ['white', 'green']}; // Adjust min/max values according to your requirement
var osaviVis = {min: -1, max: 1, palette: ['white', 'green']};
var tviVis = {min: 0, max: 5, palette: ['white', 'green']};
var rviVis = {min: 1, max: 3, palette: ['white', 'green']}; // Adjust min/max values according to your requirement
var mbiVis = {min: -0.5, max: 1.5, palette: ['white', 'yellow']};
var bsiVis = {min: -1, max: 1, palette: ['blue', 'white', 'green']}
var ndVis = {min: 0, max: 0.4, palette: ['white', 'green']};
var mndwiVis = {min: -1, max: 1, palette: ['white', 'blue']};
var bsiVis = {min:-1, max:0.5, plaette:['white', 'red']};
var saviVis = {min: 0, max: 1, palette: ['blue', 'green']};
var gndviVis = {min: 0, max: 0.5, palette: ['white', 'green']};
var ndwiVis = {min: -1, max: 0.4, palette: ['white', 'blue']};
var ndvireVis = {min: 0, max: 0.5, palette: ['white', 'green']};
var uviVis = {min: 0, max: 1.5, palette: ['white','green']};
var udwiVis = {min: 0, max: 0.1, palette: ['white', 'blue']};
var endisiVisParams = {min: -1, max: 0.5, palette: ['blue', 'white']};
var uciVisParams = {min: 0, max: 0.5, palette: ['white', 'green']};
var gviVis = {min: 0, max: 5, palette: ['yellow', 'green']};
var ndreVis = {min: -0.001, max: 0.5, palette: ['red', 'green']};


//>> Add layers to the map
Map.addLayer(lai.clip(roi), laiVis, 'LAI');
Map.addLayer(osavi.clip(roi), osaviVis, 'OSAVI');
Map.addLayer(tvi.clip(roi), tviVis, 'TVI');
Map.addLayer(rvi.clip(roi), rviVis, 'RVI');
Map.addLayer(mbi.clip(roi), mbiVis, 'MBI');
Map.addLayer(ndvi.clip(roi), ndVis, 'NDVI');
Map.addLayer(mndwi.clip(roi), mndwiVis, 'MNDWI');
Map.addLayer(bsi.clip(roi), bsiVis, 'BSI');
Map.addLayer(savi.clip(roi), saviVis, 'SAVI');
Map.addLayer(gndvi.clip(roi), gndviVis, 'GNDVI');
Map.addLayer(ndwi.clip(roi), ndwiVis, 'NDWI');
Map.addLayer(ndvire.clip(roi), ndvireVis, 'NDVIre');
Map.addLayer(uvi.clip(roi), uviVis, 'UVI');
Map.addLayer(udwi.clip(roi), udwiVis, 'UDWI');
Map.addLayer(endisi.clip(roi), endisiVisParams, 'ENDISI');
Map.addLayer(uci.clip(roi), uciVisParams, 'UCI');
Map.addLayer(gvi.clip(roi), gviVis, 'GVI');
Map.addLayer(ndre.clip(roi), ndreVis, 'NDRE');

//>> Merge training samples
var samples = vegetation.merge(bare_land).merge(water).merge(built_ups);

//>> Sample regions for training
var training = jodhpur21.addBands([ndvi, mndwi, bsi, savi, gndvi, lai, osavi, tvi, rvi, mbi, ndwi, ndvire, uvi, udwi, endisi, uci, gvi, ndre])
    .sampleRegions({
        collection: samples,
        properties: ['class'],
        scale: 10,
    });
print(training); 
 
//>> Train the classifier
var classifier = ee.Classifier.smileRandomForest(150).train({
    features: training,
    classProperty: 'class',
    inputProperties: ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12', 'NDVI', 'MNDWI', 'BSI', 'SAVI', 'GNDVI', 'LAI', 'OSAVI', 'TVI','RVI','MBI','NDWI', 'NDVIre','UVI','UDWI','ENDISI', 'UCI','GVI','NDRE']
});

var jodhpur21_with_indices = jodhpur21.addBands([ndvi, mndwi, bsi, savi, gndvi, lai, osavi, tvi, rvi, mbi, ndwi, ndvire, uvi, udwi, endisi, uci, gvi, ndre]);

//>> Classify the image
var classified = jodhpur21_with_indices.classify(classifier);

//>> Display the classified image
Map.addLayer(classified, {min: 0, max: 3, palette: ['green', 'yellow', 'blue', 'red']}, 'Jodhpur LULC 2021');


//>> Define the export
   Export.image.toDrive({
     image : classified, // image name
     description : 'Jodhpur_LULC_2021', // what will apera in the code editor that this export is running
     folder : 'export', // folder in the drive
     fileNamePrefix : 'LULC_21',
     region : roi,
     scale : 10,
     maxPixels : 1e10
  
 });


//>> calculating area of landcover classes

var all_claases_area = ee.Image.pixelArea().addBands(classified).divide(1e6)
                      .reduceRegion({
                      reducer : ee.Reducer.sum().group(1),
                      geometry: roi,
                      scale : 10,
                      bestEffort : true
                      });
                      
print(all_claases_area);                 

