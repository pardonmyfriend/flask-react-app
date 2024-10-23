from flask import Blueprint, request, jsonify
from app.models.algorithm import Algorithm

algorithms_blueprint = Blueprint('algorithms', __name__)

@algorithms_blueprint.route('/set_algorithm', methods=['POST'])
def set_algorithm():
    data = request.get_json()
    algorithm_name = data.get('algorithm')
    
    try:
        alg_obj = Algorithm(algorithm_name)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

    return jsonify({'algorithm': alg_obj.to_dict()}), 200


# @algorithms_blueprint.route('/get_algorithm_params', methods=['GET'])
# def get_algorithm_params():
#     algorithm = session.get('algorithm')
#     if algorithm:
#         return jsonify({
#             'algorithm_name': algorithm['algorithm_name'],
#             'params': algorithm['params']
#         }), 200
#     else:
#         return jsonify({'error': 'Brak zapisanych parametrów'}), 400
    

@algorithms_blueprint.route('/set_algorithm_params', methods=['POST'])
def set_algorithm_params():
    data = request.get_json()
    algorithm_name = data.get('algorithm')
    params = data.get('params')

    alg_obj = Algorithm(algorithm_name, params)

    return jsonify({'algorithm': alg_obj.to_dict()}), 200
