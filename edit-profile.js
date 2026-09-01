const editProfileForm =
    document.getElementById("editProfileForm");

const displayNameInput =
    document.getElementById("displayName");

const gamertagInput =
    document.getElementById("gamertag");

const bioInput =
    document.getElementById("bio");

const bioCount =
    document.getElementById("bioCount");

const avatarPreview =
    document.getElementById("avatarPreview");

const avatarInput =
    document.getElementById("avatarInput");

const avatarFileName =
    document.getElementById("avatarFileName");

const formMessage =
    document.getElementById("formMessage");

const saveButton =
    document.getElementById("saveButton");

const profilePicture =
    document.getElementById("profilePicture");

const profileGamertag =
    document.getElementById("profileGamertag");


let currentUser = null;
let selectedAvatarFile = null;


async function loadEditProfile() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    if (!session?.user) {
        window.location.href = "login.html";
        return;
    }


    currentUser = session.user;


    const {
        data: profile,
        error
    } = await supabaseClient
        .from("profiles")
        .select(
            "gamertag, display_name, avatar_url, bio"
        )
        .eq("id", currentUser.id)
        .single();


    if (error || !profile) {

        formMessage.textContent =
            "Unable to load profile.";

        console.error(error);

        return;
    }


    const avatar =
        profile.avatar_url ||
        "Default Apex Games Profile Picture.png";


    avatarPreview.src = avatar;
    profilePicture.src = avatar;

    profileGamertag.textContent =
        profile.gamertag;

    gamertagInput.value =
        profile.gamertag;

    displayNameInput.value =
        profile.display_name || "";

    bioInput.value =
        profile.bio || "";

    updateBioCounter();

}


function updateBioCounter() {

    bioCount.textContent =
        bioInput.value.length;

}


bioInput.addEventListener(
    "input",
    updateBioCounter
);


avatarInput.addEventListener(
    "change",
    () => {

        const file =
            avatarInput.files[0];


        if (!file) {
            return;
        }


        if (!file.type.startsWith("image/")) {

            formMessage.textContent =
                "Please choose an image file.";

            avatarInput.value = "";

            return;
        }


        if (file.size > 5 * 1024 * 1024) {

            formMessage.textContent =
                "Profile pictures must be 5 MB or smaller.";

            avatarInput.value = "";

            return;
        }


        selectedAvatarFile = file;

        avatarFileName.textContent =
            file.name;


        const previewURL =
            URL.createObjectURL(file);

        avatarPreview.src =
            previewURL;

        formMessage.textContent = "";

    }
);


editProfileForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!currentUser) {
            return;
        }


        saveButton.disabled = true;

        formMessage.textContent =
            "Saving changes...";


        const displayName =
            displayNameInput.value.trim();

        const bio =
            bioInput.value.trim();


        const {
            error
        } = await supabaseClient
            .from("profiles")
            .update({
                display_name:
                    displayName || null,

                bio:
                    bio || null,

                updated_at:
                    new Date().toISOString()
            })
            .eq("id", currentUser.id);


        if (error) {

            formMessage.textContent =
                "Unable to save profile.";

            console.error(error);

            saveButton.disabled = false;

            return;
        }


        formMessage.textContent =
            "Profile updated!";


        setTimeout(() => {

            window.location.href =
                "profile.html";

        }, 700);

    }
);


loadEditProfile();
