import os
import io
import logging
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import base64

# --- Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# --- Flask App Initialization ---
app = Flask(__name__)
CORS(app)
logging.info("Flask app initialized with CORS.")

# --- Load the AI Model ---
try:
    model = tf.keras.models.load_model('plant_disease_model.h5')
    logging.info("AI model 'plant_disease_model.h5' loaded successfully.")
    # Check model input shape
    logging.info(f"Model input shape: {model.input_shape}")
except Exception as e:
    logging.error(f"Error loading model: {e}")
    model = None

# --- Define the Class Names ---
class_names = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]
logging.info(f"Loaded {len(class_names)} class names.")

# --- Disease Information and Solutions Database ---
disease_info = {
    'Apple___Apple_scab': {
        'name': 'Apple Scab',
        'description': 'A fungal disease that causes dark, scaly lesions on leaves and fruits.',
        'solutions': [
            'Apply fungicides containing myclobutanil or captan',
            'Prune trees to improve air circulation',
            'Remove and destroy fallen leaves in autumn to reduce spore spread',
            'Plant resistant varieties like Liberty or Enterprise'
        ]
    },
    'Apple___Black_rot': {
        'name': 'Apple Black Rot',
        'description': 'A fungal disease causing fruit rot and leaf spots.',
        'solutions': [
            'Remove and destroy infected fruits and branches',
            'Apply fungicides during bloom period',
            'Practice good sanitation by cleaning up fallen fruit and leaves',
            'Ensure proper spacing between trees for air circulation'
        ]
    },
    'Apple___Cedar_apple_rust': {
        'name': 'Cedar Apple Rust',
        'description': 'A fungal disease that requires both apple and cedar trees to complete its life cycle.',
        'solutions': [
            'Remove nearby juniper/cedar trees if possible',
            'Apply fungicides in early spring when buds break',
            'Plant resistant varieties like William\'s Pride or Freedom',
            'Use protective fungicides containing myclobutanil or fenarimol'
        ]
    },
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': {
        'name': 'Gray Leaf Spot',
        'description': 'A fungal disease causing rectangular lesions on corn leaves.',
        'solutions': [
            'Plant resistant hybrids',
            'Practice crop rotation with non-host crops',
            'Apply fungicides when disease first appears',
            'Till crop residue to reduce fungal survival'
        ]
    },
    'Corn_(maize)___Common_rust_': {
        'name': 'Common Rust of Corn',
        'description': 'A fungal disease causing pustules on leaves that reduce photosynthesis.',
        'solutions': [
            'Plant resistant hybrids',
            'Apply fungicides when disease first appears',
            'Practice crop rotation with non-host crops',
            'Ensure proper plant spacing for air movement'
        ]
    },
    'Corn_(maize)___Northern_Leaf_Blight': {
        'name': 'Northern Corn Leaf Blight',
        'description': 'A fungal disease causing long, elliptical gray-green lesions on leaves.',
        'solutions': [
            'Plant resistant hybrids',
            'Practice crop rotation',
            'Apply fungicides during vegetative growth stages',
            'Manage crop residue to reduce inoculum'
        ]
    },
    'Tomato___Early_blight': {
        'name': 'Tomato Early Blight',
        'description': 'A common fungal disease causing target-like lesions on leaves.',
        'solutions': [
            'Apply copper-based fungicides or chlorothalonil',
            'Mulch around plants to prevent soil splashing',
            'Remove and destroy infected plant parts',
            'Practice crop rotation (avoid planting tomatoes in same spot for 2-3 years)'
        ]
    },
    'Tomato___Late_blight': {
        'name': 'Tomato Late Blight',
        'description': 'A devastating fungal disease that can destroy entire crops quickly.',
        'solutions': [
            'Apply fungicides containing chlorothalonil or mancozeb preventatively',
            'Remove and destroy infected plants immediately',
            'Avoid overhead watering to reduce leaf wetness',
            'Choose resistant varieties when available'
        ]
    },
    'Tomato___Septoria_leaf_spot': {
        'name': 'Septoria Leaf Spot',
        'description': 'A fungal disease causing small circular spots with dark borders on leaves.',
        'solutions': [
            'Apply copper-based fungicides or chlorothalonil',
            'Remove infected leaves as soon as symptoms appear',
            'Avoid overhead watering',
            'Mulch around plants to prevent soil splashing'
        ]
    },
    'Potato___Early_blight': {
        'name': 'Potato Early Blight',
        'description': 'A fungal disease causing concentric rings on leaves and stems.',
        'solutions': [
            'Apply fungicides containing chlorothalonil or mancozeb',
            'Practice crop rotation (3-year rotation recommended)',
            'Use certified disease-free seed potatoes',
            'Ensure proper nutrition, especially nitrogen'
        ]
    },
    'Potato___Late_blight': {
        'name': 'Potato Late Blight',
        'description': 'The same disease that caused the Irish Potato Famine, causing rapid plant destruction.',
        'solutions': [
            'Apply fungicides preventatively during favorable weather conditions',
            'Destroy infected plants and tubers immediately',
            'Plant resistant varieties when available',
            'Ensure proper drainage and avoid overhead irrigation'
        ]
    },
    'Grape___Black_rot': {
        'name': 'Grape Black Rot',
        'description': 'A fungal disease causing dark, circular lesions on leaves and fruit mummification.',
        'solutions': [
            'Apply fungicides from bud break through fruit development',
            'Prune vines to improve air circulation',
            'Remove and destroy mummified fruits',
            'Sanitize pruning tools between plants'
        ]
    },
    'healthy': {
        'name': 'Healthy Plant',
        'description': 'Your plant appears to be healthy with no signs of disease.',
        'solutions': [
            'Continue current care practices',
            'Monitor regularly for early signs of problems',
            'Practice crop rotation to maintain soil health',
            'Maintain proper spacing between plants for air circulation'
        ]
    }
}

# Default response for diseases not in our database
default_disease_info = {
    'name': 'Plant Health Issue Detected',
    'description': 'We\'ve detected a plant health issue but specific information is limited for this particular disease.',
    'solutions': [
        'Remove and destroy severely infected plant parts',
        'Improve air circulation around plants',
        'Avoid overhead watering to reduce leaf wetness',
        'Consult with local agricultural extension service for specific recommendations'
    ]
}

# --- Helper Functions ---
def is_allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary (for PNG with transparency)
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        # Resize to match model's expected input
        image = image.resize((224, 224))
        
        # Convert to numpy array and normalize
        image_array = np.array(image) / 255.0
        
        # Add batch dimension
        image_array = np.expand_dims(image_array, axis=0)
        
        logging.info(f"Image processed. Shape: {image_array.shape}, Range: [{image_array.min():.3f}, {image_array.max():.3f}]")
        return image_array
        
    except Exception as e:
        logging.error(f"Error processing image: {e}")
        raise e

def get_disease_info(disease_class):
    # Check if the specific disease is in our database
    if disease_class in disease_info:
        return disease_info[disease_class]
    
    # Check for general categories (like "healthy")
    if 'healthy' in disease_class:
        return disease_info['healthy']
    
    # Try to find a matching general category
    for key in disease_info:
        if key.split('___')[-1].lower() in disease_class.lower():
            return disease_info[key]
    
    # Return default information if no match found
    return default_disease_info

def extract_image_from_data_url(data_url):
    # Extract base64 data from data URL
    header, encoded = data_url.split(",", 1)
    # Get the file extension from the header
    extension = header.split("/")[1].split(";")[0]
    # Decode the base64 data
    return base64.b64decode(encoded), extension

# --- Debug Endpoints ---
@app.route('/model-info', methods=['GET'])
def model_info():
    if model is None:
        return jsonify({'error': 'Model not loaded'})
    
    # Get model summary
    summary = []
    model.summary(print_fn=lambda x: summary.append(x))
    
    return jsonify({
        'input_shape': str(model.input_shape),
        'output_shape': str(model.output_shape),
        'layers': len(model.layers),
        'summary': summary
    })

@app.route('/debug-predict', methods=['POST'])
def debug_predict():
    if model is None:
        return jsonify({'error': 'Model is not available'}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        image_bytes = file.read()
        processed_image = preprocess_image(image_bytes)

        # Make prediction
        prediction = model.predict(processed_image)
        
        # DEBUG: Log prediction details
        logging.info(f"Prediction shape: {prediction.shape}")
        logging.info(f"Number of classes: {len(class_names)}")
        
        # Get top 5 predictions with bounds checking
        top_5_indices = np.argsort(prediction[0])[-5:][::-1]
        top_5_predictions = []
        
        for i in top_5_indices:
            if i < len(class_names):
                top_5_predictions.append({
                    'class': class_names[i],
                    'confidence': float(prediction[0][i]),
                    'percentage': f"{prediction[0][i] * 100:.2f}%"
                })
            else:
                logging.error(f"Index {i} out of range for class names (0-{len(class_names)-1})")
        
        # Check if predictions are diverse or all the same
        confidence_range = np.max(prediction[0]) - np.min(prediction[0])
        
        return jsonify({
            'all_predictions': [float(x) for x in prediction[0]],
            'top_5': top_5_predictions,
            'confidence_range': float(confidence_range),
            'max_confidence': float(np.max(prediction[0])),
            'min_confidence': float(np.min(prediction[0])),
            'class_count': len(class_names),
            'diagnosis': 'Model might have issues' if confidence_range < 0.1 else 'Predictions seem diverse'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/test-model', methods=['GET'])
def test_model():
    if model is None:
        return jsonify({'error': 'Model not loaded'})
    
    # Test with random data
    test_data = np.random.random((1, 224, 224, 3))
    prediction = model.predict(test_data)
    
    # Check if prediction indices are valid
    valid_indices = []
    for i in [np.argmax(prediction[0])]:
        if i < len(class_names):
            valid_indices.append(i)
        else:
            logging.error(f"Invalid index {i} in prediction")
    
    result = {
        'random_input_prediction': [float(x) for x in prediction[0]],
        'random_max_class': class_names[valid_indices[0]] if valid_indices else 'INVALID_INDEX',
        'prediction_length': len(prediction[0]),
        'class_names_length': len(class_names),
        'match': len(prediction[0]) == len(class_names)
    }
    
    return jsonify(result)

# --- API Endpoints ---
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model is not available'}), 500

    logging.info("Received a request on /predict endpoint.")

    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not is_allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Please upload a .png, .jpg, or .jpeg'}), 400

    try:
        image_bytes = file.read()
        processed_image = preprocess_image(image_bytes)

        # Make prediction
        prediction = model.predict(processed_image)
        
        # DEBUG: Check if prediction matches class names
        if prediction.shape[1] != len(class_names):
            error_msg = f"Model output dimension ({prediction.shape[1]}) doesn't match class names count ({len(class_names)})"
            logging.error(error_msg)
            return jsonify({'error': error_msg}), 500
        
        predicted_class_index = np.argmax(prediction)
        
        # Validate the index
        if predicted_class_index >= len(class_names) or predicted_class_index < 0:
            error_msg = f"Predicted index {predicted_class_index} is out of range for class names (0-{len(class_names)-1})"
            logging.error(error_msg)
            return jsonify({'error': error_msg}), 500
            
        predicted_class_name = class_names[predicted_class_index]
        confidence = float(np.max(prediction))
        
        # Log the top 3 predictions for debugging
        top_indices = np.argsort(prediction[0])[-3:][::-1]
        for i, idx in enumerate(top_indices):
            if idx < len(class_names):
                logging.info(f"Top {i+1}: {class_names[idx]} - {prediction[0][idx]:.4f}")
            else:
                logging.error(f"Invalid index in top predictions: {idx}")
        
        # Get disease information and solutions
        disease_data = get_disease_info(predicted_class_name)
        
        logging.info(f"Prediction successful: {predicted_class_name} with {confidence:.4f} confidence.")

        return jsonify({
            'disease': predicted_class_name,
            'disease_name': disease_data['name'],
            'description': disease_data['description'],
            'solutions': disease_data['solutions'],
            'confidence': confidence
        })

    except Exception as e:
        logging.error(f"An error occurred during prediction: {e}")
        return jsonify({'error': f'An internal error occurred: {str(e)}'}), 500

@app.route('/analyze', methods=['POST'])
def analyze():
    if model is None:
        return jsonify({'error': 'Model is not available'}), 500

    logging.info("Received a request on /analyze endpoint.")
    
    try:
        # Check if we're receiving multipart form data (traditional file upload)
        if 'image' in request.files:
            file = request.files['image']
            if file.filename == '':
                return jsonify({'error': 'No selected file'}), 400
                
            if not is_allowed_file(file.filename):
                return jsonify({'error': 'Invalid file type. Please upload a .png, .jpg, or .jpeg'}), 400
                
            image_data = file.read()
            crop_type = request.form.get('crop', 'Unknown')
            season = request.form.get('season', 'Unknown')
            
        else:
            return jsonify({'error': 'Unsupported content type. Please use form data with image file.'}), 400

        # Process the image
        processed_image = preprocess_image(image_data)
        
        # Make prediction
        prediction = model.predict(processed_image)
        
        # DEBUG: Check if prediction matches class names
        if prediction.shape[1] != len(class_names):
            error_msg = f"Model output dimension ({prediction.shape[1]}) doesn't match class names count ({len(class_names)})"
            logging.error(error_msg)
            return jsonify({'error': error_msg}), 500
        
        predicted_class_index = np.argmax(prediction)
        
        # Validate the index
        if predicted_class_index >= len(class_names) or predicted_class_index < 0:
            error_msg = f"Predicted index {predicted_class_index} is out of range for class names (0-{len(class_names)-1})"
            logging.error(error_msg)
            return jsonify({'error': error_msg}), 500
            
        predicted_class_name = class_names[predicted_class_index]
        confidence = float(np.max(prediction))
        
        # Log the top 3 predictions for debugging
        top_indices = np.argsort(prediction[0])[-3:][::-1]
        for i, idx in enumerate(top_indices):
            if idx < len(class_names):
                logging.info(f"Top {i+1}: {class_names[idx]} - {prediction[0][idx]:.4f}")
            else:
                logging.error(f"Invalid index in top predictions: {idx}")
        
        # Get disease information and solutions
        disease_data = get_disease_info(predicted_class_name)
        
        logging.info(f"Analysis successful: {predicted_class_name} with {confidence:.4f} confidence for crop: {crop_type}, season: {season}")

        # Return response in the format expected by the frontend
        return jsonify({
            'disease': predicted_class_name,
            'disease_name': disease_data['name'],
            'description': disease_data['description'],
            'treatment': disease_data['solutions'],
            'confidence': confidence,
            'crop_type': crop_type,
            'season': season
        })

    except Exception as e:
        logging.error(f"An error occurred during analysis: {e}")
        return jsonify({'error': f'An internal error occurred: {str(e)}'}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'model_input_shape': str(model.input_shape) if model else 'No model loaded',
        'class_names_count': len(class_names) if model else 0
    })

# Diagnostic endpoint
@app.route('/diagnostics', methods=['GET'])
def diagnostics():
    """Endpoint to check model and class names configuration"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
        
    # Get model output shape
    dummy_input = np.random.random((1, 224, 224, 3))
    dummy_prediction = model.predict(dummy_input)
    
    return jsonify({
        'model_loaded': True,
        'model_output_shape': str(dummy_prediction.shape),
        'model_output_classes': dummy_prediction.shape[1],
        'class_names_count': len(class_names),
        'match': dummy_prediction.shape[1] == len(class_names),
        'class_names_sample': class_names[:5]  # Show first 5 classes
    })

# Test endpoint to verify image processing
@app.route('/test-image', methods=['POST'])
def test_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    try:
        image_bytes = file.read()
        processed_image = preprocess_image(image_bytes)
        
        return jsonify({
            'success': True,
            'image_shape': str(processed_image.shape),
            'image_range': f"{processed_image.min():.4f} to {processed_image.max():.4f}"
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- Run the App ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)