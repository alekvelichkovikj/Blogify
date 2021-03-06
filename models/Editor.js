const {Schema, model} = require('mongoose');

const editorSchema = new Schema ({
    username: String,
    password: String,
    name: String,
    bio: String,
    email: String,
    imageUrl: String,
    imgName: String,
    publicId: String
},{
    timestamps: true
});

const Editor = model('Editor', editorSchema);

module.exports = Editor;