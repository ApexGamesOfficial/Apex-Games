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


/* =========================================
   LOAD PROFILE
========================================= */

async function loadEditProfile() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    if (!session?.user) {

        window.location.href =
            "login.html";

        return;
    }


    currentUser = session.user;


    const {
        data: profile,
        error
    } = await supabaseClient
        .from("profiles")
        .select(`
            gamertag,
            display_name,
            avatar_url,
            bio
        `)
        .eq(
            "id",
            currentUser.id
        )
        .single();


    if (error || !profile) {

        console.error(
            "Unable to load profile:",
            error
        );

        formMessage.textContent =
            "Unable to load profile.";

        return;
    }


    const avatar =
        profile.avatar_url ||
        "Default Apex Games Profile Picture.png";


    avatarPreview.src =
        avatar;

    profilePicture.src =
        avatar;

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


/* =========================================
   BIO COUNTER
========================================= */

function updateBioCounter() {

    bioCount.textContent =
        bioInput.value.length;
}


bioInput.addEventListener(
    "input",
    updateBioCounter
);


/* =========================================
   AVATAR PREVIEW
========================================= */

avatarInput.addEventListener(
    "change",
    () => {

        const file =
            avatarInput.files[0];


        if (!file) {
            return;
        }


        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/webp"
        ];


        if (!allowedTypes.includes(file.type)) {

            formMessage.textContent =
                "Please choose a PNG, JPG, or WEBP image.";

            avatarInput.value = "";

            return;
        }


        if (
            file.size >
            5 * 1024 * 1024
        ) {

            formMessage.textContent =
                "Profile pictures must be 5 MB or smaller.";

            avatarInput.value = "";

            return;
        }


        selectedAvatarFile =
            file;

        avatarFileName.textContent =
            file.name;


        const previewURL =
            URL.createObjectURL(file);

        avatarPreview.src =
            previewURL;

        formMessage.textContent =
            "";
    }
);


/* =========================================
   SAVE PROFILE
========================================= */

editProfileForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!currentUser) {
            return;
        }


        saveButton.disabled =
            true;

        formMessage.textContent =
            "Saving changes...";


        const displayName =
            displayNameInput.value.trim();

        const bio =
            bioInput.value.trim();


        let avatarUrl = null;


        /* =================================
           UPLOAD AVATAR
        ================================= */

        if (selectedAvatarFile) {

            formMessage.textContent =
                "Uploading profile picture...";


            const fileExtension =
                selectedAvatarFile.name
                    .split(".")
                    .pop()
                    .toLowerCase();


            const avatarPath =
                `${currentUser.id}/profile.${fileExtension}`;


            const {
                error: uploadError
            } = await supabaseClient
                .storage
                .from("avatars")
                .upload(
                    avatarPath,
                    selectedAvatarFile,
                    {
                        upsert: true,
                        contentType:
                            selectedAvatarFile.type
                    }
                );


            if (uploadError) {

                console.error(
                    "Avatar upload failed:",
                    uploadError
                );

                formMessage.textContent =
                    "Upload failed: " +
                    uploadError.message;

                saveButton.disabled =
                    false;

                return;
            }


            const {
                data: publicUrlData
            } = supabaseClient
                .storage
                .from("avatars")
                .getPublicUrl(
                    avatarPath
                );


            avatarUrl =
                publicUrlData.publicUrl +
                `?v=${Date.now()}`;
        }


        /* =================================
           UPDATE PROFILE TABLE
        ================================= */

        const profileChanges = {

            display_name:
                displayName || null,

            bio:
                bio || null,

            updated_at:
                new Date().toISOString()
        };


        if (avatarUrl) {

            profileChanges.avatar_url =
                avatarUrl;
        }


        const {
            error
        } = await supabaseClient
            .from("profiles")
            .update(
                profileChanges
            )
            .eq(
                "id",
                currentUser.id
            );


        if (error) {

            console.error(
                "Profile update failed:",
                error
            );

            formMessage.textContent =
                "Unable to save profile: " +
                error.message;

            saveButton.disabled =
                false;

            return;
        }


        formMessage.textContent =
            "Profile updated!";


        setTimeout(
            () => {

                window.location.href =
                    "profile.html";

            },
            600
        );
    }
);


/* =========================================
   START
========================================= */

loadEditProfile();
