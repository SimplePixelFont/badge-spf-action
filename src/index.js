const jimp = require("jimp");
const spf = require("web-spf");
const core = require("@actions/core");
const github = require("@actions/github");

async function get_logo() {
    let image = await jimp.Jimp.read(core.getInput("logo"));

    return {
        width: image.bitmap.width,
        height: image.bitmap.height,
        data: image.bitmap.data,
    };
}

async function get_font() {
    try {
        const response = await fetch(core.getInput("font"));
        if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        return bytes;
    } catch (error) {
        console.error("Error fetching file:", error);
        return null;
  }
}

async function create_badge() {
    let icon = await get_logo();
    let font = spf.load_layout_from_file("badge-font", await get_font(), true);

    let label_socket = new spf.PrintSocket();
    label_socket.text = core.getInput("label");
    label_socket.letter_spacing = 1;
    
    let message_socket = new spf.PrintSocket();
    message_socket.text = core.getInput("message");
    message_socket.letter_spacing = 1;

    let socket = new spf.BadgeSocket();
    socket.label = label_socket;
    socket.message = message_socket;
    socket.label_color = core.getInput("labelColor");
    socket.color = core.getInput("color");

    let logo_texture = new spf.Texture();
    logo_texture.width = icon.width;
    logo_texture.height = icon.height;
    logo_texture.texture_data = icon.data;
    socket.logo = logo_texture;
    const texture = spf.print_badge(socket);
    console.log("we good so far!");

    const width = texture.width;
    const height = texture.height;
    const texture_data = texture.texture_data;

    const image = new jimp.Jimp({data: texture_data, width: width, height: height});
    image.write(core.getInput("filename"));
}

try {
    create_badge();
} catch (error) {
    core.setFailed(error.message);
}
