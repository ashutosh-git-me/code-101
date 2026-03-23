#include<iostream>
using namespace std;

int unique(int arr[], int size){
    for(int i=0; i<size; i++){
        bool isUnique=true;
        for(int j=0; j<size; j++){
            if(arr[i]==arr[j] && i!=j){
                isUnique=false;
                break;
            }
        }
        if(isUnique){
            return arr[i];
        }
    }
    return 0;
}

int main()
{
    int array[7]={2, 1, 1 ,6 , 3, 6, 2};
    cout<<"Unique Element is: "<<unique(array, 7);
}