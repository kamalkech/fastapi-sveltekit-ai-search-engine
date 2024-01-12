import { Model } from 'objection';
import db from '$lib/database';

Model.knex(db);

class UserModel extends Model {
	static get tableName() {
		return 'users';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['email', 'username', 'password'],

			properties: {
				id: { type: 'integer' },
				email: { type: 'string', minLength: 1, maxLength: 255 },
				username: { type: 'string', minLength: 1, maxLength: 255 },
				password: { type: 'string', minLength: 1, maxLength: 255 }
			}
		};
	}

	// static get relationMappings() {
	// 	return {
	// 		sessions: {
	// 			relation: Model.HasManyRelation,
	// 			modelClass: Chat,
	// 			join: {
	// 				from: 'users.id',
	// 				to: 'sessions.username'
	// 			}
	// 		}
	// 	};
	// }
}

export default UserModel;
