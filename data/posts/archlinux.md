---
title: Archlinux installation
published_at: 2022-10-05
snippet: Archlinux with the latest & greatest tools available (2022)
---

This guide is a convenient combination of
[Offical Arch Linux Installation Guide](https://wiki.archlinux.org/title/Installation_guide)
and [Ermanno's amazing guide](https://gitlab.com/eflinux/arch-basic).

Github repo: https://github.com/arcbjorn/arc-arch-linux-installation-guide.

**Important:** This is an installation with the latest & greatest tools
available (2022). For more robust installation (Xorg, Swap partition, etc.),
please refer to my robust
[Arch linux installation guide](https://github.com/arcbjorn/arc-robust-arch-linux-installation-guide).

### Minimal archlinux installation

1-11 steps

- [BTRFS filesystem](https://btrfs.wiki.kernel.org/index.php/Main_Page)
- [ZRAM](https://en.wikipedia.org/wiki/Zram)
- [Pipewire](https://pipewire.org/)
- [Wayland](https://wayland.freedesktop.org/)

### For full Desktop GUI

12 step

Minimal Desktop GUI with native Wayland support installation:

- [sway](https://github.com/swaywm/sway) (Window manager)
- [ly](https://github.com/nullgemm/ly) (Login manager)
- [firefox-developer-edition](https://www.mozilla.org/en-US/firefox/developer/)
  (Mozilla Firefox browser)
- [wofi](https://hg.sr.ht/~scoopta/wofi) (App Launcher)
- [lxappearance](https://archlinux.org/packages/community/x86_64/lxappearance/)
  (Theme customization for apps with GTK+ frontend)
- [qt5ct](https://sourceforge.net/projects/qt5ct/) (Theme customization for apps
  with Qt frontend)
- [python-pywal](https://github.com/dylanaraps/pywal) (Theme color generator)
- [waybar](https://github.com/Alexays/Waybar) (Status bar)
- [pcmanfm-qt](https://github.com/lxqt/pcmanfm-qt) (File manager)
- [pass](https://www.passwordstore.org/) (Password manager)
- [foot](https://codeberg.org/dnkl/foot) (Terminal emulator)
- [neofetch](https://github.com/dylanaraps/neofetch) (CLI to display system
  specs)
- [dunst](https://github.com/dunst-project/dunst) (System notifications manager)
- [timeshift](https://github.com/teejee2008/timeshift) (System backup & restore
  tool)
- [xorg-xwayland](https://wayland.freedesktop.org/xserver.html) (Compatibility
  layer between Xorg and Wayland)
- [qt5-wayland](https://wiki.qt.io/QtWayland) (Compatibility layer between Qt
  and Wayland)
- [swayidle](https://github.com/swaywm/swayidle) (Idle manager)
- [swaylock-effects](https://github.com/mortie/swaylock-effects) (Screenlock)

### Installation

1. Boot from USB drive with Arch ISO

2. Prepare the disk (partitions) - using GPT device

```bash
# check the disks
lsblk

# partition the disk - create GPT Labels
gdisk /dev/***

# choose new GPT Label command:
o

# First Partition for EFI
# choose new command:
n
# choose default partition number
# choose default First Sector memory
# choose Last Sector memory:
+550M
# enter the EFI partition code:
ef00

# Second Partition for main SSD storage
# choose new command
n
# choose default partition number
# choose default First Sector memory
# choose Last Sector memory:
(remaining SSD space - 2 GB)G
# choose default partition type (Linux Filesystem)

# Choose "write" command to overwrite exiting partitions:
w
```

3. Format partitions

```bash
# make fat32 filesystem for EFI
mkfs.vfat /dev/***1
# make butterFS filesystem for main storage
mkfs.btrfs  /dev/***2
```

3. ButterFS configuration

```bash
# mount main partition - root subvolume
mount  /dev/***2 /mnt

cd /mnt
# make btrFS subvolume for root subvolume
btrfs subvolume create @
# make btrFS subvolume for home subvolume
btrfs subvolume create @home
# make btrFS subvolume for var subvolume
btrfs subvolume create @var

cd
# unmount main partition - root subvolume
umount /mnt

# mount root subvolume
mount -o noatime, compress=zstd, space_cache,discard=async,subvol=@ /dev/***2 /mnt

# directories var, home & var
mkdir -p /mnt/boot/efi
mkdir /mnt/{home,var}

# mount home & var subvolumes
mount -o noatime, compress=zstd, space_cache,discard=async,subvol=@home /dev/***2 /mnt/home

mount -o noatime, compress=zstd, space_cache,discard=async,subvol=@var /dev/***2 /mnt/var
```

4. Mount EFI partition

```bash
mount /dev/***1 /mnt/boot/efi
```

5. Install the base system

```bash
# for amd processor: amd-ucode instead of intel-ucode
pacstrap /mnt base linux linux-firmware git vim intel-ucode btrfs-progs
```

6. Generate filesystem table

```bash
genfstab -U /mnt >> /mnt/etc/fstab
```

7. Make new root directory with all mounts needed

```bash
# detach from main filesystem and process tree
arch-chroot /mnt

# check the fs & table
ls
cat /etc/fstab
```

8. Run base archlinux system intall script

```bash
# give exec permissions to script
git clone https://github.com/arcbjorn/arc-arch-linux-installation-guide
cd arc-arch-linux-installation-guide
# don't forget to change username & password to yours :)
chmod +x base.sh

# run from root filesystem
cd /
./arc-arch-linux-installation-guide/base.sh

# choose xdr-desktop-portal-wlr (to use with Sway)
```

9. Check system init config

```bash
vim /etc/mkinitcpio.conf
# if butterFS used on 2 disks - put "btrfs" parameter in MODULES
# if amd or nvidia card is used - put "amdgpu" or "nvidia" parameters in MODULES accordingly

# if config was changed, recreate initramfs:
mkinitcpio -p linux
```

10. Finish base packages installation

```bash
exit
umount -a
reboot
```

11. Install Desktop GUI & tools

```bash
# copy the guide from root filesystem to home repository
cp -r /arc-arch-linux-installation-guide .
cd /arc-arch-linux-installation-guide

# give exec permissions to script
chmod +x sway.sh

# go back to home directory
cd ..
./arc-arch-linux-installation-guide/sway.sh
```

12. Configure ZRAM (used for SWAP)

```bash
paru -S zramd
sudo systemctl enable --now zramd.service

# check the block devices table
lsblk

reboot
```

### Enjoy your fresh system :)
